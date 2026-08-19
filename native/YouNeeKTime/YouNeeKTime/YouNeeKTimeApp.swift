import SwiftUI

@main
struct YouNeeKTimeApp: App {
    var body: some Scene {
        WindowGroup {
            WatchClockView()
                .preferredColorScheme(.dark)
        }
    }
}
