# SUMO:BIT Extension ofr Microsoft MakeCode

This code provides the driver for [**SUMO:BIT**](https://www.cytron.io/p-sumobit).

**SUMO:BIT** is a sumo robot expansion board designed for the BBC micro:bit. It emulates the educational focus of the micro:bit and the simplicity of its coding environment to simplify robotic projects, specifically sumo robots.

![SUMO:BIT](https://raw.githubusercontent.com/CytronTechnologies/pxt-sumobit/master/sumobit.png)


## Adding the Extension in MakeCode Editor  
* open [https://makecode.microbit.org/](https://makecode.microbit.org/)
* click on **New Project** and give your project a meaningful name
* click on **Extensions** under the gearwheel :gear: menu
* search for '**sumobit**' or "**https://github.com/cytrontechnologies/pxt-sumobit**" 
* click on the sumobit card to install the extension


# Examples

## DC Motors

* Use ``run (motor selection) motor (direction) at (speed) speed with (accelaration) acceleration factor`` block to control the motors.
* Acceleration factor 1 to 9 gradually increase acceleration.
* The  ``set motors speed: left (speed) right (speed) acceleration (accelaration)`` block
* To stop the motor, use the ``brake (motor selection) motor`` block.

### Moving the robot foward or backward

```blocks

input.onButtonPressed(Button.A, function () {
    sumobit.runMotor(SumobitMotorChannel.Both, SumobitMotorDirection.Forward, 100, 9)
    basic.pause(1000)
    sumobit.stopMotor(SumobitMotorChannel.Both)
    basic.pause(200)
    sumobit.runMotor(sumobit.MotorChannel.All, MotorDirection.Backward, 100, 0)
    basic.pause(1000)
    sumobit.brakeMotor(sumobit.MotorChannel.All)
})

```

### Making a left or right turn

```blocks

input.onButtonPressed(Button.A, function () {
    sumobit.runMotor(sumobit.MotorChannel.All, MotorDirection.Forward, 100)
    basic.pause(1000)
    sumobit.runMotor(sumobit.MotorChannel.MR, MotorDirection.Backward, 50)
    sumobit.runMotor(sumobit.MotorChannel.ML, MotorDirection.Forward, 50)
    basic.pause(500)
    sumobit.runMotor(sumobit.MotorChannel.All, MotorDirection.Forward, 50)
    basic.pause(500)
    sumobit.runMotor(sumobit.MotorChannel.MR, MotorDirection.Backward, 0)
    sumobit.runMotor(sumobit.MotorChannel.ML, MotorDirection.Forward, 50)
    basic.pause(1000)
    sumobit.runMotor(sumobit.MotorChannel.All, MotorDirection.Forward, 100, 5)
    basic.pause(800)
    sumobit.brakeMotor(sumobit.MotorChannel.All)
})

```

## RGB

* Turn off all RGB pixels using the ``clear all RGB pixels`` block.
* Set an individual pixel color with ``set RGB pixel (pixel number) to (RGB value)``, or set all pixels using ``set all RGB pixels to (RGB value)``.
* Use the ``red (r value) green (g value) blue (b value)`` block to define custom RGB values.

### Basic RGB control

```blocks

basic.forever(function () {
    sumobit.setRgbPixelColor(0, 0x0000ff)
    sumobit.setRgbPixelColor(1, 0xffff00)
    basic.pause(2000)
    sumobit.setAllRgbPixelsColor(sumobit.rgb(255, 0, 255))
    basic.pause(2000)
    sumobit.clearAllRgbPixels()
    basic.pause(2000)
})

```

## Opponent Sensors

* Use ``(sensor selection) opponent sensor`` to read the current state (0 or 1) of the digital opponent sensors.
* The ``(sensor selection) sensor detect opponent`` boolean block returns true if the selected sensor detects an obstacle (Low).
* Simplify conditional logic by combining all opponent sensor states with ``L(toggle) FL(toggle) FC(toggle) FR(toggle) R(toggle)`` boolean block

### Display sensor state and perform an action when a condition is met

```blocks

basic.forever(function () {
    basic.showNumber(sumobit.OppSensorValue(SensorSelection1.Center))
    if (sumobit.OppSensorDetection(SensorSelection2.Center)) {
        sumobit.setAllRgbPixelsColor(0xff0000)
    } else {
        sumobit.setAllRgbPixelsColor(0x00ff00)
    }
})

```

### Basic sumo attack routine conditional block

```blocks

basic.forever(function () {
    if (sumobit.OppSensorDetection(SensorSelection2.Center)) {
        sumobit.runMotor(sumobit.MotorChannel.All, MotorDirection.Forward, 255, 5)
    } else if (sumobit.OppSensorDetection(SensorSelection2.Left1)) {
        sumobit.runMotor(sumobit.MotorChannel.MR, MotorDirection.Forward, 255, 5)
        sumobit.runMotor(sumobit.MotorChannel.ML, MotorDirection.Backward, 0)
    } else if (sumobit.OppSensorDetection(SensorSelection2.Right1)) {
        sumobit.runMotor(sumobit.MotorChannel.MR, MotorDirection.Backward, 0)
        sumobit.runMotor(sumobit.MotorChannel.ML, MotorDirection.Forward, 255, 5)
    } else if (sumobit.OppSensorDetection(SensorSelection2.Left2)) {
        sumobit.runMotor(sumobit.MotorChannel.MR, MotorDirection.Forward, 100, 5)
        sumobit.runMotor(sumobit.MotorChannel.ML, MotorDirection.Backward, 100, 5)
        basic.pause(300)
    } else if (sumobit.OppSensorDetection(SensorSelection2.Right2)) {
        sumobit.runMotor(sumobit.MotorChannel.MR, MotorDirection.Backward, 100, 5)
        sumobit.runMotor(sumobit.MotorChannel.ML, MotorDirection.Forward, 100, 5)
        basic.pause(300)
    }
})

```

### Sumo attack routine when more than one sensor detects an opponent

```blocks
basic.forever(function () {
    if (sumobit.OppSensorCombinationBoolean(true, false, false, true, true)) {
        sumobit.runMotor(sumobit.MotorChannel.MR, MotorDirection.Forward, 255, 5)
        sumobit.runMotor(sumobit.MotorChannel.ML, MotorDirection.Backward, 128, 5)
    }
})

```

## Edge Sensor

* The ``right edge sensor`` and ``left edge sensor`` blocks return analog outputs from the edge sensors.
* The ``(sensor selection) edge sensor (comparision type) (threshold)`` is a boolean block will return true if the analog value of the sensor 

### Read sensors value on white and black surface

```blocks

basic.forever(function () {
    serial.writeString("RIGHT EDGE: ")
    serial.writeString("" + (sumobit.readEdgeRValue()))
    serial.writeString(" | LEFT EDGE: ")
    serial.writeString("" + (sumobit.readEdgeLValue()))
    serial.writeLine("")
    basic.pause(500)
})

```

### Basic Backoff routine

```blocks

basic.forever(function () {
    if (sumobit.compareEdge(EdgeSide.Right, EdgeCompareType.MoreThan, 600)) {
        // Reverse
        sumobit.runMotor(sumobit.MotorChannel.All, MotorDirection.Backward, 50)
        basic.pause(300)
        // Rotate right backward
        sumobit.runMotor(sumobit.MotorChannel.MR, MotorDirection.Backward, 50)
        sumobit.runMotor(sumobit.MotorChannel.ML, MotorDirection.Forward, 50)
        basic.pause(600)
        // Stop the motors
        sumobit.brakeMotor(sumobit.MotorChannel.All)
        basic.pause(50)
    }
})

```

## Mode

* The ``mode``  block reads the current DIP switch state (0-16).
* The ``mode (mode number)`` boolean block returns true when a specific mode is selected.


### Display current mode and perform an action based on selected mode

```blocks

basic.forever(function () {
    basic.showNumber(sumobit.readModeValue())
    if (sumobit.checkMode(11)) {
        sumobit.setAllRgbPixelsColor(0x00ff00)
    } else {
        sumobit.setAllRgbPixelsColor(0xff0000)
    }
})

```

## Motor Current

* The ``right motor current`` and ``left motor current`` blocks return the respective motor current value (up to 2 decimal places).
* Use the ``on (motor selection) current (comparision type) (threshold)``  block to trigger an event when the motor current exceeds the specified threshold.

### Making a sharp turn when the motor stalls

```blocks

sumobit.onEvent(CompareSelect.M1, CompareType.MoreThan, 7, function () {
    sumobit.runMotor(sumobit.MotorChannel.MR, MotorDirection.Backward, 100)
    sumobit.runMotor(sumobit.MotorChannel.ML, MotorDirection.Forward, 0)
    basic.pause(600)
    sumobit.brakeMotor(sumobit.MotorChannel.All)
    basic.pause(50)
})

```


## Servo

* Use the ``set servo (servo selection) position to (angle) degrees`` block to control the servo angle.
* The ``disable servo (servo selection)`` block resets the servo(s) to the initial position (90°).

### Basic servo control

```blocks

input.onButtonPressed(Button.A, function () {
    sumobit.setServoPosition(ServoChannel.S1, 0)
    sumobit.setServoPosition(ServoChannel.S2, 180)
})
input.onButtonPressed(Button.AB, function () {
    sumobit.disableServo(ServoChannel.All)
})
input.onButtonPressed(Button.B, function () {
    sumobit.setServoPosition(ServoChannel.S1, 180)
    sumobit.setServoPosition(ServoChannel.S2, 0)
})

```


## Battery

* The ``batery voltage`` block returns the current battery voltage.

### Display battery level and give warning when battery is low

```blocks

basic.forever(function () {
    basic.showNumber(sumobit.readBatteryValue())
    if (sumobit.readBatteryValue() <= 10) {
        sumobit.setAllRgbPixelsColor(0xff0000)
    } else {
        sumobit.clearAllRgbPixels()
    }
})

```







