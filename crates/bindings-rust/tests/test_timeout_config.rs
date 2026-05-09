#![cfg(unix)]

use serialpilot_rust::{Port, TTYPort};
use std::time::Duration;

#[test]
fn timeout_roundtrip_consistency() {
    let (mut master, mut slave) = TTYPort::pair().expect("Unable to create ptty pair");

    let timeout = Duration::from_millis(250);
    master.set_timeout(timeout).unwrap();
    slave.set_timeout(timeout).unwrap();

    assert_eq!(master.timeout(), timeout);
    assert_eq!(slave.timeout(), timeout);
}
