//! Non-hardware enumeration smoke tests.

#[test]
fn available_ports_is_stable() {
    let ports = serialpilot_rust::available_ports().expect("Enumeration should not fail");

    for port in ports {
        assert!(
            !port.port_name.trim().is_empty(),
            "Port names returned by enumeration must be non-empty"
        );
    }
}
