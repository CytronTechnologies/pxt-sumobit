/*******************************************************************************
 * Functions for SUMO:BIT opponent sensors
 *
 * Company: Cytron Technologies Sdn Bhd
 * Website: http://www.cytron.io
 * Email:   support@cytron.io
 *******************************************************************************/



// Used in opponent sensor return value block
enum SumobitSensorSelection1 {
    //% block="left"
    Left = 0,

    //% block="front left"
    FrontLeft = 1,

    //% block="front center"
    Center = 2,

    //% block="front right"
    FrontRight = 3,

    //% block="right"
    Right = 4,
}

// Used in opponent sensor boolean block
enum SumobitSensorSelection2 {
    //% block="left"
    Left = 0,

    //% block="front left"
    FrontLeft = 1,

    //% block="front center"
    Center = 2,

    //% block="front right"
    FrontRight = 3,

    //% block="right"
    Right = 4,

    //% block="all"
    //% blockHidden=true
    All = 5,

    //% block="none"
    None = 6
}


namespace sumobit {


    /**
    * Read the opponent sensor value. 
    */
    //% group="Opponent Sensors"
    //% weight=89
    //% blockGap=8
    //% blockId=sumobit_maker_object_read_digital
    //% block="%sensor opponent sensor"
    //% position.fieldEditor="gridpicker" position.fieldOptions.columns=5
    export function oppSensorValue(sensor: SumobitSensorSelection1): number {

        // Software pullup for the opponent sensors
        pins.setPull(DigitalPin.P16, PinPullMode.PullUp)
        pins.setPull(DigitalPin.P15, PinPullMode.PullUp)
        pins.setPull(DigitalPin.P14, PinPullMode.PullUp)
        pins.setPull(DigitalPin.P13, PinPullMode.PullUp)
        pins.setPull(DigitalPin.P12, PinPullMode.PullUp)

        switch (sensor) {
            case SumobitSensorSelection1.Left:
                return pins.digitalReadPin(DigitalPin.P16);
            case SumobitSensorSelection1.FrontLeft:
                return pins.digitalReadPin(DigitalPin.P15);;
            case SumobitSensorSelection1.Center:
                return pins.digitalReadPin(DigitalPin.P14);
            case SumobitSensorSelection1.FrontRight:
                return pins.digitalReadPin(DigitalPin.P13);
            case SumobitSensorSelection1.Right:
                return pins.digitalReadPin(DigitalPin.P12);

        }

    }

    /**
     * Return true if the opponent sensor is low (Obstacle detected). 
     */
    //% group="Opponent Sensors"
    //% weight=88
    //% blockGap=8
    //% blockId=sumobit_maker_object_detect_opponent
    //% block="%position sensor detect opponent"
    
    export function oppSensorDetection(position: SumobitSensorSelection2): boolean {



        let L = oppSensorValue(0);
        let FL = oppSensorValue(1);
        let FC = oppSensorValue(2);
        let FR = oppSensorValue(3);
        let R = oppSensorValue(4);

        switch (position) {
            case SumobitSensorSelection2.None:
                if (L == 1 && FL == 1 && FC == 1 && FR == 1 && R == 1)
                    return true;
                else return false;

            case SumobitSensorSelection2.Left:
                if (L == 0)
                    return true;
                else return false;

            case SumobitSensorSelection2.FrontLeft:
                if (FL == 0)
                    return true;
                else return false;

            case SumobitSensorSelection2.Center:
                if (FC == 0)
                    return true;
                else return false;

            case SumobitSensorSelection2.FrontRight:
                if (FR == 0)
                    return true;
                else return false;

            case SumobitSensorSelection2.Right:
                if (R == 0)
                    return true;
                else return false;

            case SumobitSensorSelection2.All:
                if (L == 0 && FL == 0 && FC == 0 && FR == 0 && R == 0)
                    return true;
                else return false;
        }

        return false;
    }

    /**
    * Compare the toggle values with the current sensor states.
    * Returns true if ALL match. (LOW = obstacle detacted).
    */
    //% group="Opponent Sensors"
    //% weight=87
    //% blockId=sumobit_maker_object_compare_expected_with_sensor
    //% block="left$TogL front left$TogFL centre$TogFC front right$TogFR right$TogR"
    //% TogL.shadow="toggleHighLow" TogFL.shadow="toggleHighLow" TogFC.shadow="toggleHighLow" TogFR.shadow="toggleHighLow" TogR.shadow="toggleHighLow"
    //% inlineInputMode=inline
    //% blockHidden=true

    export function oppSensorCombinationBoolean(TogL: boolean, TogFL: boolean, TogFC: boolean, TogFR: boolean, TogR: boolean): boolean {
    let sensorValues = [

        oppSensorValue(0), // L
        oppSensorValue(1), // FL
        oppSensorValue(2), // FC
        oppSensorValue(3), // FR
        oppSensorValue(4)  // R
    ];
        let referenceValues = [TogL ? 1 : 0, TogFL ? 1 : 0, TogFC ? 1 : 0, TogFR ? 1 : 0, TogR ? 1 : 0];
    

    // Compare each value in sensorValues with referenceValues
    for (let i = 0; i < sensorValues.length; i++) {
        if (sensorValues[i] !== referenceValues[i]) {
                // If any value does not match, return false
                return false;
            }
        }

        // If all values match, return true
        return true;
    }
    

}