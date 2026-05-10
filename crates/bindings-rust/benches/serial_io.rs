// `PortBuilder::exclusive` is unix-only. On non-unix targets the criterion
// benches are no-ops and we provide a stub `main` so the bench still compiles.

#[cfg(unix)]
use criterion::{criterion_group, criterion_main, Criterion};

#[cfg(unix)]
fn bench_builder_construction(c: &mut Criterion) {
    c.bench_function("builder:new+settings", |b| {
        b.iter(|| {
            let _ = serialpilot_rust::new("/dev/ttyUSB0", 115_200)
                .timeout(std::time::Duration::from_millis(10))
                .data_bits(serialpilot_rust::DataBits::Eight)
                .flow_control(serialpilot_rust::FlowControl::None)
                .parity(serialpilot_rust::Parity::None)
                .stop_bits(serialpilot_rust::StopBits::One)
                .exclusive(false);
        })
    });
}

#[cfg(unix)]
fn bench_port_enumeration(c: &mut Criterion) {
    c.bench_function("available_ports", |b| {
        b.iter(|| {
            let _ = serialpilot_rust::available_ports();
        })
    });
}

#[cfg(unix)]
criterion_group!(
    serialpilot_benches,
    bench_builder_construction,
    bench_port_enumeration
);
#[cfg(unix)]
criterion_main!(serialpilot_benches);

#[cfg(not(unix))]
fn main() {}
