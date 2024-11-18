# SUMO:BIT Extension for Microsoft MakeCode

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

* Use ``run (motor selection) motor (direction) at (speed) speed with (accelaration) acceleration factor`` block to control the right and left motors indivually or both motors simultaneously.
* The ``set motors speed: left (speed) right (speed) acceleration (accelaration)`` block enables you to control both motors with different speeds in one block. Please note that both motors will share the same acceleration factor. A common application of this block is for turn or rotate.
* To stop the motor, use the ``brake (motor selection) motor`` block.

### Moving the robot foward or backward



```blocks

input.onButtonPressed(Button.A, function () {
    // Both motor move forward at 100 speed and 9 acceleration factor for 1 second
    sumobit.runMotor(SumobitMotorChannel.Both, SumobitMotorDirection.Forward, 100, 9)
    basic.pause(1000) 
    // Stop both motors for 0.2 second
    sumobit.stopMotor(SumobitMotorChannel.Both)
    basic.pause(200)
    // Both motor move backwatd at 100 speed and 9 acceleration factor for 1 second
    sumobit.runMotor(sumobit.MotorChannel.All, MotorDirection.Backward, 100, 0)
    basic.pause(1000)
    // Stop both motors
    sumobit.stopMotor(SumobitMotorChannel.Both)
})

```

### Making a left or right turn

```blocks

input.onButtonPressed(Button.A, function () {
    // Both motor move forward at 100 speed and 9 acceleration factor for 1 second
    sumobit.runMotor(SumobitMotorChannel.Both, SumobitMotorDirection.Forward, 100, 9)
    basic.pause(1000)
    // Rotate in place by running both motors in opposite directions
    sumobit.setMotorsSpeed(50, -50, 9)
    basic.pause(500)
    // Run both motor at 50 speed and 9 acceleration factor for 0.5 second
    sumobit.runMotor(SumobitMotorChannel.Both, SumobitMotorDirection.Forward, 50, 9)
    basic.pause(500)
    // Rotate around the right wheel by stopping the right motor and running the left motor
    sumobit.setMotorsSpeed(0, 50, 9)
    basic.pause(1000)
    // Run both motor at 50 speed and 9 acceleration factor for 0.8 second
    sumobit.runMotor(SumobitMotorChannel.Both, SumobitMotorDirection.Forward, 100, 9)
    basic.pause(800
    // Stop both motors)
    sumobit.stopMotor(SumobitMotorChannel.Both)
})

```

## RGB

* Turn off all RGB pixels using the ``clear all RGB pixels`` block.
* Set an individual pixel color with ``set RGB pixel (pixel number) to (RGB value)``, or set all pixels using ``set all RGB pixels to (RGB value)``.
* Use the ``red (r value) green (g value) blue (b value)`` block to define custom RGB values.

### Basic RGB control

```blocks

basic.forever(function () {
    // Show blue colour on RGB0 LED
    sumobit.setRgbPixelColor(0, 0x0000ff)
    // Show yellow colour on RGB1 LED
    sumobit.setRgbPixelColor(1, 0xffff00)
    basic.pause(2000)
    // Show purple colour on RGB LED pixels
    sumobit.setAllRgbPixelsColor(sumobit.rgb(255, 0, 255))
    basic.pause(2000)
    // Turn off all RGB lights
    sumobit.clearAllRgbPixels()
    basic.pause(2000)
})

```

## Opponent Sensors

* Use ``(sensor selection) opponent sensor`` to read the current state (0 or 1) of the digital opponent sensors.
* The ``(sensor selection) sensor detect opponent`` boolean block returns true if the selected sensor detects an obstacle (Low).

### Display the opponent sensor state and perform an action when obstacle is detected

```blocks

basic.forever(function () {
    // LED matrix display the current state of the front center opponent sensor (0 or 1)
    basic.showNumber(sumobit.oppSensorValue(SumobitSensorSelection1.Center))
    // Red RGB will light up if obstacle detacted by the front center opponent sensor
    if (sumobit.oppSensorDetection(SumobitSensorSelection2.Left)) {
        sumobit.setAllRgbPixelsColor(0xff0000)
    } else {
        sumobit.clearAllRgbPixels()
    }
})

```

## Edge Sensor

* The ``(sensor selection) edge sensor`` block return analog outputs from the edge sensors.
* Use the ``calibrate edge sensor``  block to automatically find the threshold for detecting the white edge of the Dohyo.
* The ``(sensor selection) sensor detact edge)`` is a boolean block that will return true if the edge is detacted (analog value is less than threshold.

### Read the analog input values of right and left edge sensors

```blocks

basic.forever(function () {
    serial.writeString("RIGHT EDGE: ")
    serial.writeString("" + (sumobit.fetchEdgeValue(SumobitEdgeSelection.Right)))
    serial.writeString(" | LEFT EDGE: ")
    serial.writeString("" + (sumobit.fetchEdgeValue(SumobitEdgeSelection.Left)))
    serial.writeLine("")
    basic.pause(500)
})


```

### Basic Backoff routine

```blocks

// Calibrate the edge sensor to find the threshold value
sumobit.calibrateEdgeThreshold()
basic.forever(function () {
    // Check if the sensor reading is less than threshold value (edge detected)
    if (sumobit.compareEdgeCalibrated(SumobitEdgeSelection.Right)) {
        // Reverse the robot to move away from the edge
        sumobit.runMotor(SumobitMotorChannel.Both, SumobitMotorDirection.Backward, 50, 9)
        basic.pause(300)
        // Make a ~180 degree rotation
        sumobit.setMotorsSpeed(-50, 50)
        basic.pause(500)
        // Stop the robot for a while before continue searching for opponent
        sumobit.stopMotor(SumobitMotorChannel.Both)
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
    // LED matrix display the current mode
    basic.showNumber(sumobit.readModeValue())
    // Red RGB will light up when the current mode is 7
    if (sumobit.checkMode(7)) {
        sumobit.setAllRgbPixelsColor(0x00ff00)
    } else {
        sumobit.clearAllRgbPixels()
    }
})

```

## Battery

* The ``batery voltage`` block returns the current battery voltage.

### Display battery level and give warning when battery is low

```blocks

basic.forever(function () {
    // LED matrix diplay the battery voltage
    basic.showNumber(sumobit.readBatteryValue())
    // Red RGB will light up when the battery voltage is less tgab 11V
    if (sumobit.readBatteryValue() < 11) {
        sumobit.setAllRgbPixelsColor(0xff0000)
    } else {
        sumobit.clearAllRgbPixels()
    }
})

```

## More (Robot Kit)

* Use the ``set robot speed(speed)`` block to set the initial speed of both motor. The speed be used in most of blocks in this section.
* The `` start countdown (3 second or 5 second)`` is use to start LED matric countdown from (3 or 5 second) to 9. The block is commmonly use befort starting a sumo robot match.
* ``backoff (direction)`` is a preset backoff routine. Direction is the rotation direction of the robot after edge is detected.
* The ``attack (mode)`` is a preset attack routine that can be used for both testing and during the game. The robot's reaction will be based on which opponent sensor detects an opponent.














