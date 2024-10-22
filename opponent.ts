/*******************************************************************************
 * Functions for SUMO:BIT opponent sensors
 *
 * Company: Cytron Technologies Sdn Bhd
 * Website: http://www.cytron.io
 * Email:   support@cytron.io
 *******************************************************************************/


enum SensorSelection1 {
    //% block="left"
    Left2 = 0,

    //% block="front left"
    Left1 = 1,

    //% block="front center"
    Center = 2,

    //% block="front right"
    Right1 = 3,

    //% block="right"
    Right2 = 4,
}

enum SensorSelection2 {
    //% block="left"
    Left2 = 0,

    //% block="front left"
    Left1 = 1,

    //% block="front center"
    Center = 2,

    //% block="front right"
    Right1 = 3,

    //% block="right"
    Right2 = 4,

    //% block="all"
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
    //% block="%sensor Opponent sensor"
    export function OppSensorValue(sensor: SensorSelection1): number {

        switch (sensor) {
            case SensorSelection1.Left2:
                return pins.digitalReadPin(DigitalPin.P16);
            case SensorSelection1.Left1:
                return pins.digitalReadPin(DigitalPin.P15);;
            case SensorSelection1.Center:
                return pins.digitalReadPin(DigitalPin.P14);
            case SensorSelection1.Right1:
                return pins.digitalReadPin(DigitalPin.P13);
            case SensorSelection1.Right2:
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
    //% position.fieldEditor="gridpicker" position.fieldOptions.columns=5
    export function OppSensorDetection(position: SensorSelection2): boolean {



        let L = OppSensorValue(0);
        let FL = OppSensorValue(1);
        let FC = OppSensorValue(2);
        let FR = OppSensorValue(3);
        let R = OppSensorValue(4);

        switch (position) {
            case SensorSelection2.None:
                if (L == 1 && FL == 1 && FC == 1 && FR == 1 && R == 1)
                    return true;
                else return false;

            case SensorSelection2.Left2:
                if (L == 0 && FL == 1 && FC == 1 && FR == 1 && R == 1)
                    return true;
                else return false;

            case SensorSelection2.Left1:
                if (L == 1 && FL == 0 && FC == 1 && FR == 1 && R == 1)
                    return true;
                else return false;

            case SensorSelection2.Center:
                if (L == 1 && FL == 1 && FC == 0 && FR == 1 && R == 1)
                    return true;
                else return false;

            case SensorSelection2.Right1:
                if (L == 1 && FL == 1 && FC == 1 && FR == 0 && R == 1)
                    return true;
                else return false;

            case SensorSelection2.Right2:
                if (L == 1 && FL == 1 && FC == 1 && FR == 1 && R == 0)
                    return true;
                else return false;

            case SensorSelection2.All:
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
    //% block="L$TogL FL$TogFL FC$TogFC FR$TogFR R$TogR"
    //% TogL.shadow="toggleHighLow" TogFL.shadow="toggleHighLow" TogFC.shadow="toggleHighLow" TogFR.shadow="toggleHighLow" TogR.shadow="toggleHighLow"
    //% inlineInputMode=inline
    export function OppSensorCombinationBoolean(TogL: boolean, TogFL: boolean, TogFC: boolean, TogFR: boolean, TogR: boolean): boolean {
    let sensorValues = [

        OppSensorValue(0), // L
        OppSensorValue(1), // FL
        OppSensorValue(2), // FC
        OppSensorValue(3), // FR
        OppSensorValue(4)  // R
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