/**
 * tests go here; this will not be compiled when this package is used as a library
 */
function inputSerialDisplay() {
    serial.writeString("OPP: ")
    serial.writeNumber(sumobit.oppSensorValue(SumobitSensorSelection1.Left))
    serial.writeNumber(sumobit.oppSensorValue(SumobitSensorSelection1.FrontLeft))
    serial.writeNumber(sumobit.oppSensorValue(SumobitSensorSelection1.Center))
    serial.writeNumber(sumobit.oppSensorValue(SumobitSensorSelection1.FrontRight))
    serial.writeNumber(sumobit.oppSensorValue(SumobitSensorSelection1.Right))
    serial.writeString(" | ")
    serial.writeString("EDGE_R: ")
    serial.writeNumber(sumobit.fetchEdgeValue(SumobitEdgeSelection.Right))
    serial.writeString(" EDGE_L: ")
    serial.writeNumber(sumobit.fetchEdgeValue(SumobitEdgeSelection.Left))
    serial.writeString(" | ")
    serial.writeString("")
    serial.writeString("Mode: ")
    serial.writeNumber(sumobit.readModeValue())
    serial.writeString(" | ")
    serial.writeString("Battery: ")
    serial.writeNumber(sumobit.readBatteryValue())
    serial.writeLine("")
    basic.pause(100)
}
sumobit.calibrateEdgeThreshold(5)
sumobit.setAllRgbPixelsColor(0xff0000)
sumobit.disableServo(SumobitServoChannel.All)
basic.pause(100)
sumobit.setRgbPixelColor(0, sumobit.rgb(0, 0, 255))
sumobit.setRgbPixelColor(1, 0x00ffff)
sumobit.setServoPosition(SumobitServoChannel.Servo1, 90, 5)
basic.pause(100)
sumobit.clearAllRgbPixels()
sumobit.countdown(SumobitCountdown.Three)
sumobit.setMotorsSpeed(100, 100, 9)
sumobit.setServoPosition(SumobitServoChannel.Servo2, 90, 5)
basic.pause(500)
sumobit.runMotor(SumobitMotorChannel.RightMotor, SumobitMotorDirection.Forward, 128, 9)
sumobit.runMotor(SumobitMotorChannel.RightMotor, SumobitMotorDirection.Backward, 128, 9)
sumobit.setServoPosition(SumobitServoChannel.Servo2, 180, 5)
basic.pause(300)
sumobit.stopMotor(SumobitMotorChannel.Both)
let StartVar = 1
basic.clearScreen()
basic.forever(function () {
    inputSerialDisplay()
    if (StartVar == 1) {
        if (sumobit.checkMode(1)) {
            if (sumobit.oppSensorDetection(SumobitSensorSelection2.Left)) {
                basic.showLeds(`
                    # . . . .
                    . . . . .
                    . . . . .
                    . . . . .
                    . . . . .
                    `)
            } else if (sumobit.oppSensorDetection(SumobitSensorSelection2.FrontLeft)) {
                basic.showLeds(`
                    . # . . .
                    . . . . .
                    . . . . .
                    . . . . .
                    . . . . .
                    `)
            } else if (sumobit.oppSensorDetection(SumobitSensorSelection2.Center)) {
                basic.showLeds(`
                    . . # . .
                    . . . . .
                    . . . . .
                    . . . . .
                    . . . . .
                    `)
            } else if (sumobit.oppSensorDetection(SumobitSensorSelection2.FrontRight)) {
                basic.showLeds(`
                    . . . # .
                    . . . . .
                    . . . . .
                    . . . . .
                    . . . . .
                    `)
            } else if (sumobit.oppSensorDetection(SumobitSensorSelection2.Right)) {
                basic.showLeds(`
                    . . . . #
                    . . . . .
                    . . . . .
                    . . . . .
                    . . . . .
                    `)
            } else {
                basic.clearScreen()
            }
        } else {

        }
        if (sumobit.checkMode(2)) {
            sumobit.attack(0, 9)
        } else {

        }
        if (sumobit.checkMode(3)) {
            if (sumobit.compareEdgeCalibrated(SumobitEdgeSelection.Right)) {
                sumobit.setRgbPixelColor(1, 0xff0000)
                basic.pause(500)
                sumobit.backoff(SumobitDirection.Left, 50, 9)
            } else if (sumobit.compareEdgeCalibrated(SumobitEdgeSelection.Left)) {
                sumobit.setRgbPixelColor(0, 0xff0000)
                basic.pause(500)
                sumobit.backoff(SumobitDirection.Right, 50, 9)
            } else {
                sumobit.clearAllRgbPixels()
            }
        } else {

        }
        if (sumobit.checkMode(4)) {
            sumobit.search(SumobitSearch.Normal, 50, 9)
        } else {

        }
    }
})
