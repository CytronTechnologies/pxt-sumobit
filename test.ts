// tests go here; this will not be compiled when this package is used as an extension.

function inputSerialDisplay () {
    serial.writeString("OPP: ")
    serial.writeNumber(sumobit.OppSensorValue(SensorSelection1.Left2))
    serial.writeNumber(sumobit.OppSensorValue(SensorSelection1.Left1))
    serial.writeNumber(sumobit.OppSensorValue(SensorSelection1.Center))
    serial.writeNumber(sumobit.OppSensorValue(SensorSelection1.Right1))
    serial.writeNumber(sumobit.OppSensorValue(SensorSelection1.Right2))
    serial.writeString(" | ")
    serial.writeString("EDGE_R: ")
    serial.writeNumber(sumobit.readEdgeRValue())
    serial.writeString(" EDGE_L: ")
    serial.writeNumber(sumobit.readEdgeLValue())
    serial.writeString(" | ")
    serial.writeString("")
    serial.writeString("Motor Current_R: ")
    serial.writeNumber(sumobit.readM1CurrentValue())
    serial.writeString(" Motor Current_L: ")
    serial.writeNumber(sumobit.readM2CurrentValue())
    serial.writeString(" | ")
    serial.writeString("Mode: ")
    serial.writeNumber(sumobit.readModeValue())
    serial.writeString(" | ")
    serial.writeString("Battery: ")
    serial.writeNumber(sumobit.readBatteryValue())
    serial.writeLine("")
    basic.pause(100)
}
sumobit.onEvent(CompareSelect.M1, CompareType.MoreThan, 7, function () {
    // Check if 500ms has passed to toggle the LEDs
    if (input.runningTime() - lastBlinkTime >= 500) {
        // Reset the timer
        lastBlinkTime = input.runningTime()
        // Toggle the blink state
        blinkOn = !(blinkOn)
        if (blinkOn) {
            // Turn on red LEDs
            sumobit.setAllRgbPixelsColor(0xff0000)
        } else {
            // Turn off LEDs
            sumobit.setAllRgbPixelsColor(0x000000)
        }
    }
})
let blinkOn = false
let lastBlinkTime = 0
let disableRGB = false
lastBlinkTime = input.runningTime()
sumobit.setAllRgbPixelsColor(0xff0000)
basic.pause(500)
sumobit.setRgbPixelColor(0, 0x00ffff)
sumobit.setRgbPixelColor(1, 0x0000ff)
basic.pause(500)
sumobit.clearAllRgbPixels()
sumobit.setServoPosition(ServoChannel.S1, 0)
sumobit.setServoPosition(ServoChannel.S1, 180)
sumobit.runMotor(sumobit.MotorChannel.MR, MotorDirection.Forward, 100, 4)
sumobit.runMotor(sumobit.MotorChannel.ML, MotorDirection.Forward, 100, 4)
basic.pause(1000)
sumobit.disableServo(ServoChannel.S1)
sumobit.runMotor(sumobit.MotorChannel.All, MotorDirection.Forward, 100, 4)
basic.pause(1000)
sumobit.brakeMotor(sumobit.MotorChannel.All)
let StartVar = 1
basic.forever(function () {
    if (StartVar == 1) {
        inputSerialDisplay()
        if (sumobit.OppSensorDetection(SensorSelection2.All)) {
            basic.showLeds(`
                # # # # #
                . . . . .
                . . . . .
                . . . . .
                . . . . .
                `)
        } else if (sumobit.OppSensorCombinationBoolean(true, true, true, true, true)) {
            basic.showLeds(`
                . . . . .
                . # . # .
                . . . . .
                # . . . #
                . # # # .
                `)
        }
        if (sumobit.compareEdge(EdgeSide.Right, EdgeCompareType.MoreThan, 800)) {
            sumobit.setRgbPixelColor(0, 0xffffff)
        } else {
            sumobit.setRgbPixelColor(0, 0x000000)
        }
        if (sumobit.compareEdge(EdgeSide.Left, EdgeCompareType.MoreThan, 800)) {
            sumobit.setRgbPixelColor(1, 0xffffff)
        } else {
            sumobit.setRgbPixelColor(1, 0x000000)
        }
        if (sumobit.checkMode(14)) {
            basic.showLeds(`
                # . # . #
                # . # . #
                # . # # #
                # . . . #
                # . . . #
                `)
        } else {
        	
        }
    }
})

