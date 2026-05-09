use criterion::{criterion_group, criterion_main, Criterion};

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

fn bench_port_enumeration(c: &mut Criterion) {
    c.bench_function("available_ports", |b| {
        b.iter(|| {
            let _ = serialpilot_rust::available_ports();
        })
    });
}

criterion_group!(
    serialpilot_benches,
    bench_builder_construction,
    bench_port_enumeration
);
criterion_main!(serialpilot_benches);
