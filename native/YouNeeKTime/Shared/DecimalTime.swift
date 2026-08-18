import Foundation

struct DecimalTime: Equatable {
    let progress: Double
    let units: Int
    let minutes: Int
    let seconds: Int
    let armyHours: Int
    let armyMinutes: Int
    let armySeconds: Int
    let hours12: Int
    let ampm: String
    let display: String
    let dayPercent: String
    let unitRotation: Double
    let minuteRotation: Double
    let secondRotation: Double
    let armyHourRotation: Double
    let armyMinuteRotation: Double
    let armySecondRotation: Double
    let regularHourRotation: Double
    let regularMinuteRotation: Double
    let regularSecondRotation: Double

    static func current(now: Date = Date(), calendar: Calendar = .current) -> DecimalTime {
        let startOfDay = calendar.startOfDay(for: now)
        let elapsedMs = now.timeIntervalSince(startOfDay) * 1000
        let dayMs = 86_400_000.0
        let wrapped = ((elapsedMs.truncatingRemainder(dividingBy: dayMs)) + dayMs).truncatingRemainder(dividingBy: dayMs)
        let dayProgress = wrapped / dayMs

        let totalUnits = dayProgress * 100
        let totalBaseMinutes = dayProgress * 10_000
        let totalBaseSeconds = dayProgress * 1_000_000

        let units = Int(totalUnits.rounded(.towardZero))
        let minutes = Int(totalBaseMinutes.rounded(.towardZero)) % 100
        let seconds = Int(totalBaseSeconds.rounded(.towardZero)) % 100

        let comps = calendar.dateComponents([.hour, .minute, .second, .nanosecond], from: now)
        let realHours = comps.hour ?? 0
        let realMinutes = comps.minute ?? 0
        let realSeconds = comps.second ?? 0
        let realMs = Double(comps.nanosecond ?? 0) / 1_000_000.0

        let fractionalRealMinutes = Double(realMinutes) + (Double(realSeconds) + realMs / 1000) / 60
        let armyMinutesFrac = fractionalRealMinutes * (100.0 / 60.0)
        let armyMinutes = Int(armyMinutesFrac.rounded(.towardZero)) % 100

        let fractionalRealSeconds = Double(realSeconds) + realMs / 1000
        let armySecondsFrac = fractionalRealSeconds * (100.0 / 60.0)
        let armySeconds = Int(armySecondsFrac.rounded(.towardZero)) % 100

        let hours12 = realHours % 12 == 0 ? 12 : realHours % 12
        let ampm = realHours < 12 ? "AM" : "PM"

        let unitRotation = dayProgress * 360
        let minuteRotation = (totalBaseMinutes.truncatingRemainder(dividingBy: 100)) * 3.6
        let secondRotation = (totalBaseSeconds.truncatingRemainder(dividingBy: 100)) * 3.6
        let armyHourRotation = dayProgress * 360
        let armyMinuteRotation = armyMinutesFrac * 3.6
        let armySecondRotation = armySecondsFrac * 3.6

        let hours12Frac = Double(realHours % 12) + fractionalRealMinutes / 60
        let regularHourRotation = hours12Frac * 30
        let regularMinuteRotation = fractionalRealMinutes * 6
        let regularSecondRotation = fractionalRealSeconds * 6

        let display = [units, minutes, seconds]
            .map { String(format: "%02d", $0) }
            .joined(separator: ":")

        return DecimalTime(
            progress: dayProgress,
            units: units,
            minutes: minutes,
            seconds: seconds,
            armyHours: realHours,
            armyMinutes: armyMinutes,
            armySeconds: armySeconds,
            hours12: hours12,
            ampm: ampm,
            display: display,
            dayPercent: String(format: "%.2f", dayProgress * 100),
            unitRotation: unitRotation,
            minuteRotation: minuteRotation,
            secondRotation: secondRotation,
            armyHourRotation: armyHourRotation,
            armyMinuteRotation: armyMinuteRotation,
            armySecondRotation: armySecondRotation,
            regularHourRotation: regularHourRotation,
            regularMinuteRotation: regularMinuteRotation,
            regularSecondRotation: regularSecondRotation
        )
    }

    var unitsMinutesDisplay: String {
        String(format: "%02d•%02d", units, minutes)
    }
}
