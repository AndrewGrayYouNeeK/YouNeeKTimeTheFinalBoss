import WidgetKit
import SwiftUI

private let green = Color(red: 0x39 / 255, green: 1, blue: 0x14 / 255)

struct DecimalTimeEntry: TimelineEntry {
    let date: Date
    let time: DecimalTime
}

struct DecimalTimeProvider: TimelineProvider {
    func placeholder(in context: Context) -> DecimalTimeEntry {
        DecimalTimeEntry(date: Date(), time: .current())
    }

    func getSnapshot(in context: Context, completion: @escaping (DecimalTimeEntry) -> Void) {
        completion(DecimalTimeEntry(date: Date(), time: .current()))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<DecimalTimeEntry>) -> Void) {
        let now = Date()
        var entries: [DecimalTimeEntry] = []
        for offset in 0..<15 {
            let date = now.addingTimeInterval(Double(offset) * 60)
            entries.append(DecimalTimeEntry(date: date, time: .current(now: date)))
        }
        completion(Timeline(entries: entries, policy: .atEnd))
    }
}

struct ComplicationView: View {
    let entry: DecimalTimeEntry
    @Environment(\.widgetFamily) var family

    var body: some View {
        switch family {
        case .accessoryCircular:
            ZStack {
                AccessoryWidgetBackground()
                Gauge(value: entry.time.progress) {
                    Text("YN")
                } currentValueLabel: {
                    Text(String(format: "%02d", entry.time.units))
                        .font(.system(size: 16, weight: .bold, design: .monospaced))
                }
                .gaugeStyle(.accessoryCircularCapacity)
                .tint(green)
            }
        case .accessoryCorner:
            Text(String(format: "%02d", entry.time.units))
                .font(.system(.title2, design: .monospaced).weight(.semibold))
                .foregroundStyle(green)
                .widgetLabel {
                    Text(String(format: "%02d min", entry.time.minutes))
                }
        case .accessoryInline:
            Text("YouNeeK \(entry.time.unitsMinutesDisplay)")
        case .accessoryRectangular:
            VStack(alignment: .leading, spacing: 2) {
                Text("YOUNEEK TIME")
                    .font(.system(size: 10, weight: .semibold, design: .monospaced))
                    .foregroundStyle(.secondary)
                Text(entry.time.unitsMinutesDisplay)
                    .font(.system(size: 22, weight: .semibold, design: .monospaced))
                    .foregroundStyle(green)
                Gauge(value: entry.time.progress) {
                    EmptyView()
                }
                .gaugeStyle(.accessoryLinearCapacity)
                .tint(green)
            }
        default:
            Text(entry.time.unitsMinutesDisplay)
                .foregroundStyle(green)
        }
    }
}

@main
struct YouNeeKTimeWatchWidgets: Widget {
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: "YouNeeKTimeComplication", provider: DecimalTimeProvider()) { entry in
            ComplicationView(entry: entry)
                .containerBackground(for: .widget) { Color.black }
        }
        .configurationDisplayName("YouNeeK Time")
        .description("Decimal time on your watch face.")
        .supportedFamilies([
            .accessoryCircular,
            .accessoryRectangular,
            .accessoryInline,
            .accessoryCorner
        ])
    }
}
