/*******************************************************************************
 * Functions for sumo:bit motor current measurement.
 *
 * Company: Cytron Technologies Sdn Bhd
 * Website: http://www.cytron.io
 * Email:   support@cytron.io
 *******************************************************************************/



// Motor channel (without "both")
enum SumobitMotorChannel2 {
    
    //% block="right"
    RightMotor = 0,

    //% block="left"
    LeftMotor = 1,
};


namespace sumobit {

const MOTORCURRENT_EVENT_SOURCE = 0x02;

let bgFunctionCreated = false;

// Event type.
let eventType = 0;

// Array for mode value.
let thresholdsArray: number[] = [];
let compareTypesArray: SumobitCompareType[] = [];
let motorArray: SumobitMotorChannel[] = [];

// Array for old compare result.
let oldCompareResult: boolean[] = [];


    /**
     * Read the right motor current value (2 d.p.).
     */
    //% group="Motor Current"
    //% weight=59
    //% blockGap=8
    //% blockId=sumobit_current_read_analog_m1
    //% block="right motor current"
    //% blockHidden=true
    export function readRightMotorCurrentValue(): number {
        let highByte: number;
        let lowByte: number;
        highByte = sumobit.i2cRead(REG_ADD_AN1_HIGH);
        lowByte = sumobit.i2cRead(REG_ADD_AN1_LOW);
        return ((highByte << 8) | lowByte) / 100;
    }

    /**
     * Read the left motor current value (2 d.p.).
     */
    //% group="Motor Current"
    //% weight=58
    //% blockGap=8
    //% blockId=sumobit_current_read_analog_m2
    //% block="left motor current"
    //% blockHidden=true
    export function readLeftMotorCurrentValue(): number {
        let highByte: number;
        let lowByte: number;
        highByte = sumobit.i2cRead(REG_ADD_AN2_HIGH);
        lowByte = sumobit.i2cRead(REG_ADD_AN2_LOW);
        return ((highByte << 8) | lowByte) / 100;
    }

    /**
    * Read motor current value (2 d.p.).
    */
    //% group="Motor Current"
    //% weight=58
    //% blockGap=8
    //% blockId=sumobit_current_return_value
    //% block="$motor motor current"
    //% blockHidden=true
    export function fetchMotorCurrentValue(motor: SumobitMotorChannel2): number {

    switch (motor) {
        case SumobitMotorChannel2.RightMotor:
            return readRightMotorCurrentValue();
        case SumobitMotorChannel2.LeftMotor:
            return readLeftMotorCurrentValue();
            
    }
    }


    /**
    * Compare the motor current value (0.00-20.00) with a threshold value and returns the result (true/false).
    */
    //% group="Motor Current"
    //% weight=57
    //% blockGap=40
    //% blockId=sumobit_current_compare_value
    //% block="%motor current %compareType %threshold"
    //% threshold.min=0.00 threshold.max=20.00 
    //% blockHidden=true
    export function compareCurrent(motor: SumobitMotorChannel, compareType: SumobitCompareType, threshold: number,): boolean {
        let result = false;
        let a = readRightMotorCurrentValue();
        let b = readLeftMotorCurrentValue();


        switch (motor) {
            case SumobitMotorChannel.RightMotor:
                if ((a > threshold && SumobitCompareType.MoreThan) || (a < threshold && SumobitCompareType.LessThan)) {
                    result = true;
                }
                break;

            case SumobitMotorChannel.LeftMotor:
                if ((b > threshold && SumobitCompareType.MoreThan) || (b < threshold && SumobitCompareType.LessThan)) {
                    result = true;
                }
                break;

            case SumobitMotorChannel.Both:
                if (((a > threshold && b > threshold) && SumobitCompareType.MoreThan) || ((a > threshold && b > threshold) && SumobitCompareType.LessThan)) {
                    result = true;
                }
                break;
        }

        return result;
    }

    /**
    * Compare the motor current value with a threshold value and do something when true.
    * @param motor right motor, left motor or right and left motors.
    * @param compareType More than or less than.
    * @param threshold The value to compare with. eg: 7.00
    * @param handler Code to run when the event is raised.
    */
    //% group="Motor Current"
    //% weight=56
    //% blockGap=40
    //% blockId=sumobit_current_event
    //% block="on %motor current %compareType %threshold"
    //% threshold.min=0.00 threshold.max=20.00
    //% blockHidden=true
    export function onEvent(motor: SumobitMotorChannel, compareType: SumobitCompareType, threshold: number, handler: Action): void {
        // Use a new event type everytime a new event is create.
        eventType++;

        // Add the event info to the arrays.
        motorArray.push(motor);
        compareTypesArray.push(compareType);
        thresholdsArray.push(threshold);

        // Create a placeholder for the old compare result.
        oldCompareResult.push(false);

        // Register the event.
        control.onEvent(MOTORCURRENT_EVENT_SOURCE, eventType, handler);

        // Create a function in background if haven't done so.
        // This function will check for pot value and raise the event if the condition is met.
        if (bgFunctionCreated == false) {
            control.inBackground(function () {

                while (true) {
                    // Loop for all the event created.
                    for (let i = 0; i < eventType; i++) {

                        // Check if the condition is met.
                        if (compareCurrent(motorArray[i], compareTypesArray[i], thresholdsArray[i]) == true) {
                            // Raise the event if the compare result changed from false to true.
                            if (oldCompareResult[i] == false) {
                                control.raiseEvent(MOTORCURRENT_EVENT_SOURCE, i + 1);
                            }

                            // Save old compare result.
                            oldCompareResult[i] = true;
                        }
                        else {
                            // Save old compare result.
                            oldCompareResult[i] = false;
                        }
                        basic.pause(10)
                    }
                }

            });

            bgFunctionCreated = true;
        }

    }

}
