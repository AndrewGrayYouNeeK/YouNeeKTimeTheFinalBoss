import SwiftUI

struct YouNeekShipScroll: View {
    @State private var p: CGFloat = 0

    private let travel: CGFloat = 900          // scroll distance that maps to p = 1
    private let clockExpanded: CGFloat = 340
    private let clockCollapsed: CGFloat = 140

    var body: some View {
        GeometryReader { screen in
            ScrollView(.vertical, showsIndicators: false) {
                ZStack(alignment: .top) {
                    scene(height: screen.size.height)
                        .frame(height: screen.size.height + travel)

                    Color.clear
                        .frame(height: screen.size.height + travel)
                }
            }
            .onScrollGeometryChange(for: CGFloat.self) { geo in
                geo.contentOffset.y
            } action: { _, y in
                // KEEP THIS. p is the only driver.
                p = min(1, max(0, y / travel))
            }
            .overlay(alignment: .top) {
                clock(size: lerp(clockExpanded, clockCollapsed, smooth(p, 0.28, 0.62)))
                    .padding(.top, 8)
            }
        }
        .background(Color.black)
        .ignoresSafeArea()
    }

    // MARK: - Scene layers (far → near)

    @ViewBuilder
    private func scene(height: CGFloat) -> some View {
        ZStack {
            // 1 far stars
            StarsLayer()
                .offset(y: p * height * 0.12)
                .opacity(0.35 + 0.65 * p)

            // 2 planet
            PlanetLayer()
                .offset(y: p * height * 0.28)
                .opacity(smooth(p, 0.02, 0.22))

            // 3 ship hull
            ShipHullLayer()
                .offset(y: p * height * 0.50 - 80)
                .opacity(smooth(p, 0.08, 0.30))

            // 4 hangar (nearest background)
            HangarLayer()
                .offset(y: p * height * 0.72 - 40)
                .opacity(smooth(p, 0.12, 0.36))

            // astronaut is NOT a background
            astronaut(height: height)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .clipped()
    }

    private func astronaut(height: CGFloat) -> some View {
        let launch = smooth(p, 0.18, 0.46)
        let recede = smooth(p, 0.46, 0.86)

        // starts in the hub, drops fast, then shrinks into the bay
        let y = lerp(40, height * 0.62, launch)
        let scale = lerp(0.22, 0.90, launch) * lerp(1.0, 0.28, recede)
        let opacity = smooth(p, 0.16, 0.26) * (1 - smooth(p, 0.92, 1.0))

        return Image("Astronaut")          // your asset
            .resizable()
            .scaledToFit()
            .frame(width: 180)
            .scaleEffect(scale)
            .offset(y: y)
            .opacity(opacity)
            .allowsHitTesting(false)
    }

    // MARK: - Sticky clock

    private func clock(size: CGFloat) -> some View {
        TimelineView(.periodic(from: .now, by: 0.05)) { context in
            let t = youNeek(context.date)
            YouNeekDial(
                hour: t.hour,
                minute: t.minute,
                second: t.second,
                size: size
            )
        }
        .shadow(color: .black.opacity(0.7), radius: 16)
    }
}

// MARK: - Dial (hands never attach to the astronaut)

struct YouNeekDial: View {
    let hour: Double     // 0...24 on a 00-06-12-18 face
    let minute: Double   // 0...100 if that’s your YouNeeK minute
    let second: Double
    let size: CGFloat

    var body: some View {
        ZStack {
            Circle().fill(Color.black.opacity(0.55))
            Circle().stroke(Color.cyan.opacity(0.35), lineWidth: 1)

            ticks

            // hour — short fat cyan
            hand(length: size * 0.28, width: 8, color: .cyan,
                 angle: hour / 24 * 360)

            // minute — long thin magenta
            hand(length: size * 0.40, width: 4, color: .pink,
                 angle: minute / 100 * 360)

            // seconds — yellow, stays on THIS view
            hand(length: size * 0.44, width: 2, color: .yellow,
                 angle: second / 100 * 360)

            Circle()
                .fill(Color.purple)
                .frame(width: 18, height: 18)
                .overlay(Text("Y").font(.caption.bold()).foregroundStyle(.white))
        }
        .frame(width: size, height: size)
    }

    private var ticks: some View {
        ZStack {
            ForEach(0..<24, id: \.self) { i in
                Capsule()
                    .fill(Color.cyan.opacity(i % 6 == 0 ? 1 : 0.35))
                    .frame(width: 2, height: i % 6 == 0 ? 14 : 7)
                    .offset(y: -(size * 0.46))
                    .rotationEffect(.degrees(Double(i) / 24 * 360))
            }
            labels
        }
    }

    private var labels: some View {
        ZStack {
            Text("00").offset(y: -size * 0.38)
            Text("06").offset(x:  size * 0.38)
            Text("12").offset(y:  size * 0.38)
            Text("18").offset(x: -size * 0.38)
        }
        .font(.system(size: size * 0.07, weight: .semibold, design: .rounded))
        .foregroundStyle(Color.cyan)
    }

    private func hand(length: CGFloat, width: CGFloat, color: Color, angle: Double) -> some View {
        RoundedRectangle(cornerRadius: width)
            .fill(color)
            .frame(width: width, height: length)
            .offset(y: -length / 2)
            .rotationEffect(.degrees(angle))
            .shadow(color: color.opacity(0.8), radius: 4)
    }
}

// MARK: - Math. Do not “clean this up.”

func lerp(_ a: CGFloat, _ b: CGFloat, _ t: CGFloat) -> CGFloat {
    a + (b - a) * t
}

func smooth(_ p: CGFloat, _ a: CGFloat, _ b: CGFloat) -> CGFloat {
    let t = min(1, max(0, (p - a) / (b - a)))
    return t * t * (3 - 2 * t)
}

struct YouNeekHMS {
    var hour: Double
    var minute: Double
    var second: Double
}

func youNeek(_ date: Date) -> YouNeekHMS {
    let cal = Calendar.current
    let start = cal.startOfDay(for: date)
    let real = date.timeIntervalSince(start)          // 0...86400
    let frac = real / 86_400                          // 0...1

    // 24 labels on the face, 100 youneek minutes/seconds
    let hour = frac * 24
    let minute = (frac * 100).truncatingRemainder(dividingBy: 1) * 100
    // If your app is H79 M51 S75 on a 100-hour day, swap to:
    // let hour = frac * 100
    return YouNeekHMS(
        hour: hour,
        minute: (real.truncatingRemainder(dividingBy: 3600) / 3600) * 100,
        second: (real.truncatingRemainder(dividingBy: 60) / 60) * 100
    )
}

// MARK: - Placeholder layers. Swap in your images.

struct StarsLayer: View {
    var body: some View { Color.black }
}
struct PlanetLayer: View {
    var body: some View {
        Image("Planet").resizable().scaledToFill().opacity(0.85)
    }
}
struct ShipHullLayer: View {
    var body: some View {
        Image("ShipHull").resizable().scaledToFill()
    }
}
struct HangarLayer: View {
    var body: some View {
        Image("Hangar").resizable().scaledToFill()
    }
}
