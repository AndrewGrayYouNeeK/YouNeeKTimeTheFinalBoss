import SwiftUI

private let green = Color(red: 0x39 / 255, green: 1, blue: 0x14 / 255)
private let red = Color(red: 1, green: 0x22 / 255, blue: 0x22 / 255)
private let yellow = Color(red: 1, green: 1, blue: 0)

struct WatchClockView: View {
    var body: some View {
        TimelineView(.periodic(from: .now, by: 0.05)) { context in
            let time = DecimalTime.current(now: context.date)
            VStack(spacing: 2) {
                Text(time.unitsMinutesDisplay)
                    .font(.system(size: 18, weight: .semibold, design: .monospaced))
                    .foregroundStyle(green)
                    .shadow(color: green.opacity(0.8), radius: 6)
                HStack {
                    Text(String(format: "%02d:%02d", time.hours12, Calendar.current.component(.minute, from: context.date)))
                        .foregroundStyle(Color(red: 0.96, green: 0.96, blue: 0.96))
                    Spacer()
                    Text(String(format: "%02d:%02d", time.armyHours, time.armyMinutes))
                        .foregroundStyle(Color(red: 0x2d / 255, green: 0xd9 / 255, blue: 0))
                }
                .font(.system(size: 9, weight: .medium, design: .monospaced))
                .padding(.horizontal, 10)
                AnalogDial(time: time)
                    .padding(2)
                GeometryReader { geo in
                    Capsule()
                        .fill(green.opacity(0.15))
                        .overlay(alignment: .leading) {
                            Capsule()
                                .fill(green)
                                .frame(width: max(2, geo.size.width * time.progress))
                        }
                }
                .frame(height: 4)
                .padding(.horizontal, 18)
            }
            .padding(.vertical, 2)
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(Color.black)
        }
    }
}

struct AnalogDial: View {
    let time: DecimalTime

    var body: some View {
        Canvas { context, size in
            let s = min(size.width, size.height)
            let c = CGPoint(x: size.width / 2, y: size.height / 2)
            let scale = s / 400

            func p(_ x: CGFloat, _ y: CGFloat) -> CGPoint {
                CGPoint(x: c.x + (x - 200) * scale, y: c.y + (y - 200) * scale)
            }

            var outer = Path()
            outer.addEllipse(in: CGRect(
                x: c.x - 199 * scale,
                y: c.y - 199 * scale,
                width: 398 * scale,
                height: 398 * scale
            ))
            context.stroke(outer, with: .color(green), lineWidth: 1.2 * scale)

            var inner = Path()
            inner.addEllipse(in: CGRect(
                x: c.x - 162 * scale,
                y: c.y - 162 * scale,
                width: 324 * scale,
                height: 324 * scale
            ))
            context.stroke(inner, with: .color(red.opacity(0.9)), style: StrokeStyle(lineWidth: 1 * scale, dash: [4 * scale, 5 * scale]))

            for i in 0..<24 {
                let angle = (Double(i) / 24) * .pi * 2 - .pi / 2
                let isMajor = i % 3 == 0
                let outerR = 198.0
                let innerR = isMajor ? 183.0 : 191.0
                var tick = Path()
                tick.move(to: CGPoint(x: c.x + cos(angle) * outerR * scale, y: c.y + sin(angle) * outerR * scale))
                tick.addLine(to: CGPoint(x: c.x + cos(angle) * innerR * scale, y: c.y + sin(angle) * innerR * scale))
                context.stroke(tick, with: .color(green), style: StrokeStyle(lineWidth: (isMajor ? 2.5 : 1) * scale, lineCap: .round))
            }

            for i in 0..<100 {
                let angle = (Double(i) / 100) * .pi * 2 - .pi / 2
                let isMajor = i % 10 == 0
                let innerR = isMajor ? 150.0 : 156.0
                let outerR = 162.0
                var tick = Path()
                tick.move(to: CGPoint(x: c.x + cos(angle) * innerR * scale, y: c.y + sin(angle) * innerR * scale))
                tick.addLine(to: CGPoint(x: c.x + cos(angle) * outerR * scale, y: c.y + sin(angle) * outerR * scale))
                context.stroke(tick, with: .color(red), style: StrokeStyle(lineWidth: (isMajor ? 2.2 : 0.8) * scale, lineCap: .round))
            }

            func hand(rotation: Double, tipY: CGFloat, tailY: CGFloat, color: Color, width: CGFloat) {
                context.drawLayer { ctx in
                    ctx.translateBy(x: c.x, y: c.y)
                    ctx.rotate(by: .degrees(rotation))
                    ctx.translateBy(x: -c.x, y: -c.y)
                    var path = Path()
                    path.move(to: p(200, tailY))
                    path.addLine(to: p(200, tipY))
                    ctx.stroke(path, with: .color(color), style: StrokeStyle(lineWidth: width * scale, lineCap: .round))
                }
            }

            let white = Color(red: 0.96, green: 0.96, blue: 0.96)
            let army = Color(red: 0x2d / 255, green: 0xd9 / 255, blue: 0)

            hand(rotation: time.regularHourRotation, tipY: 78, tailY: 218, color: white, width: 4.5)
            hand(rotation: time.regularMinuteRotation, tipY: 36, tailY: 222, color: white, width: 2.6)
            hand(rotation: time.regularSecondRotation, tipY: 22, tailY: 214, color: white, width: 1.2)

            context.drawLayer { ctx in
                ctx.translateBy(x: c.x, y: c.y)
                ctx.rotate(by: .degrees(time.armyHourRotation))
                ctx.translateBy(x: -c.x, y: -c.y)
                var pip = Path()
                pip.move(to: p(200, 8))
                pip.addLine(to: p(206, 22))
                pip.addLine(to: p(194, 22))
                pip.closeSubpath()
                ctx.fill(pip, with: .color(army))
            }
            hand(rotation: time.armyMinuteRotation, tipY: 48, tailY: 210, color: army, width: 2)
            hand(rotation: time.armySecondRotation, tipY: 28, tailY: 208, color: army, width: 1)

            hand(rotation: time.unitRotation, tipY: 18, tailY: 230, color: green, width: 3.5)
            hand(rotation: time.minuteRotation, tipY: 52, tailY: 230, color: red, width: 3.5)
            hand(rotation: time.secondRotation, tipY: 100, tailY: 218, color: yellow, width: 3)

            let hub = Path(ellipseIn: CGRect(
                x: c.x - 5 * scale,
                y: c.y - 5 * scale,
                width: 10 * scale,
                height: 10 * scale
            ))
            context.fill(hub, with: .color(yellow))
        }
        .aspectRatio(1, contentMode: .fit)
    }
}

#Preview {
    WatchClockView()
}
