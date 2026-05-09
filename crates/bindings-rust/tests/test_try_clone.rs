#![cfg(unix)]
extern crate serialpilot_rust;

use serialpilot_rust::{Port, TTYPort};
use std::io::{Read, Write};
use std::sync::Mutex;

use once_cell::sync::Lazy;

static TTYPAIR_LOCK: Lazy<Mutex<()>> = Lazy::new(|| Mutex::new(()));

// Test that cloning a port works as expected
#[test]
fn test_try_clone() {
    let _guard = TTYPAIR_LOCK.lock().unwrap();
    let (master, mut slave) = TTYPort::pair().expect("Unable to create ptty pair");

    // Create the clone in an inner scope to test that dropping a clone doesn't close the original
    // port
    {
        let mut clone = master.try_clone().expect("Failed to clone");
        let bytes = [b'a', b'b', b'c', b'd', b'e', b'f'];
        clone.write_all(&bytes).unwrap();
        let mut buffer = [0; 6];
        slave.read_exact(&mut buffer).unwrap();
        assert_eq!(buffer, [b'a', b'b', b'c', b'd', b'e', b'f']);
    }

    // Second try to check that the serial device is not closed
    {
        let mut clone = master.try_clone().expect("Failed to clone");
        let bytes = [b'g', b'h', b'i', b'j', b'k', b'l'];
        clone.write_all(&bytes).unwrap();
        let mut buffer = [0; 6];
        slave.read_exact(&mut buffer).unwrap();
        assert_eq!(buffer, [b'g', b'h', b'i', b'j', b'k', b'l']);
    }
}

// Test moving a cloned port into a thread
#[test]
fn test_try_clone_move() {
    use std::thread;

    let _guard = TTYPAIR_LOCK.lock().unwrap();
    let (master, mut slave) = TTYPort::pair().expect("Unable to create ptty pair");

    let mut clone = master.try_clone().expect("Failed to clone the slave");
    let loopback = thread::spawn(move || {
        let bytes = [b'a', b'b', b'c', b'd', b'e', b'f'];
        clone.write_all(&bytes).unwrap();
    });

    let mut buffer = [0; 6];
    slave.read_exact(&mut buffer).unwrap();
    assert_eq!(buffer, [b'a', b'b', b'c', b'd', b'e', b'f']);

    // The thread should have already ended, but we'll make sure here anyways.
    loopback.join().unwrap();
}

// Stress clone/write paths with concurrent writers to catch regressions in clone safety.
#[test]
fn test_try_clone_concurrent_writes() {
    use std::thread;

    let _guard = TTYPAIR_LOCK.lock().unwrap();
    let (master, mut slave) = TTYPort::pair().expect("Unable to create ptty pair");

    let mut clone_a = master.try_clone().expect("Failed to clone A");
    let mut clone_b = master.try_clone().expect("Failed to clone B");

    let t1 = thread::spawn(move || clone_a.write_all(b"AAAAAA").unwrap());
    let t2 = thread::spawn(move || clone_b.write_all(b"BBBBBB").unwrap());

    t1.join().unwrap();
    t2.join().unwrap();

    let mut buffer = [0u8; 12];
    slave.read_exact(&mut buffer).unwrap();

    let count_a = buffer.iter().filter(|&&b| b == b'A').count();
    let count_b = buffer.iter().filter(|&&b| b == b'B').count();
    assert_eq!(count_a, 6);
    assert_eq!(count_b, 6);
}
