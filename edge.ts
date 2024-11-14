/*******************************************************************************
 * Functions for SUMO:BIT edge sensors
 *
 * Company: Cytron Technologies Sdn Bhd
 * Website: http://www.cytron.io
 * Email:   support@cytron.io
 *******************************************************************************/

// Default pin.
const EDGE_R_PIN = AnalogPin.P0;
const EDGE_L_PIN = AnalogPin.P1;

// Event source.
const EDGE_SENSOR_EVENT_SOURCE = 0x03;

let sumobitRightThreshold: number;
let sumobitLeftThreshold: number;

let sumobitRightEdgeValue: number;
let sumobitLeftEdgeValue: number;

// Edge sensor selection
enum SumobitEdgeSelection {
    //% block="right"
    Right = 0,
    //% block="left"
    Left = 1,

    //% block="both"
    //% blockHidden=true
    Both = 1000
}

// Comparison type
enum SumobitCompareType {
    //% block=">"
    MoreThan = 0,

    //% block="<"
    LessThan = 1
};


namespace sumobit {

    /**
      * Read the right edge sensor value (0-1023).
      */
    //% group="Edge Sensors"
    //% weight=79
    //% blockGap=8
    //% blockId=sumobit_edge_read_analog_right
    //% block="right edge sensor"
    //% blockHidden=true
    export function readRightEdgeValue(): number {
        sumobitRightEdgeValue = pins.analogReadPin(EDGE_R_PIN);
        return pins.analogReadPin(EDGE_R_PIN);
    }

    /**
      * Read the left edge sensor value (0-1023).
      */
    //% group="Edge Sensors"
    //% weight=78
    //% blockGap=8
    //% blockId=sumobit_edge_read_analog_left
    //% block="left edge sensor"
    //% blockHidden=true
    export function readLeftEdgeValue(): number {
        sumobitLeftEdgeValue = pins.analogReadPin(EDGE_L_PIN);
        return sumobitLeftEdgeValue;
    }

    /**
      * Return the edge sensor value (0-1023).
      */
    //% group="Edge Sensors"
    //% weight=77
    //% blockGap=8
    //% blockId=sumobit_edge_return_value
    //% block="%edge edge sensor"
    export function fetchEdgeValue(edge: SumobitEdgeSelection): number {

        switch (edge) {
            case SumobitEdgeSelection.Right:
                return readRightEdgeValue();
            case SumobitEdgeSelection.Left:
                return readLeftEdgeValue();
            case SumobitEdgeSelection.Both:
                return readRightEdgeValue();
        }
    }

    /**
    * Compare the edge sensor value (0-1023) with certain value and return true if condition is meet.
    * @param EdgeSide Which side of edge sensors are to compare to. eg: 0
    * @param compareType More than or less than. eg: 0
    * @param threshold The value to compare with. eg: 512
    */
    //% group="Edge Sensors"
    //% weight=76
    //% blockGap=40
    //% blockId=sumobit_edge_compare_user_threshold
    //% block="%edge edge sensor %compareType %threshold"
    //% threshold.min=0 threshold.max=1023
    //% blockHidden=true
    export function compareEdgeDefined(edge: SumobitEdgeSelection, compareType: SumobitCompareType, threshold: number,): boolean {

        let result = false;
        let R = readRightEdgeValue();
        let L = readLeftEdgeValue();

        switch (edge) {
            case SumobitEdgeSelection.Right:
                if ((R > threshold && SumobitCompareType.MoreThan) || (R < threshold && SumobitCompareType.LessThan)) {
                    result = true;
                }
                break;

            case SumobitEdgeSelection.Left:
                if ((L > threshold && SumobitCompareType.MoreThan) || (L < threshold && SumobitCompareType.LessThan)) {
                    result = true;
                }
                break;

            case SumobitEdgeSelection.Both:
                if (((R > threshold && L > threshold) && SumobitCompareType.MoreThan) || ((R > threshold && L > threshold) && SumobitCompareType.LessThan)) {
                    result = true;
                }
                break;
        }
        return result;
    }

    /**
    * Edge threshold auto calibration.
    */
    //% group="Edge Sensors"
    //% weight=75
    //% blockGap=8
    //% blockId=sumobit_edge_calibrate_threshold
    //% block="calibrate edge sensor"
    export function calibrateEdgeThreshold(): void {
    
    let startTime1 = control.millis();

    while (control.millis() - startTime1 < 1000) {
    
    sumobitRightThreshold = pins.analogReadPin(EDGE_R_PIN)*0.5;
    sumobitLeftThreshold  = pins.analogReadPin(EDGE_L_PIN)*0.5;
    
    }
}

    /**
    * Return the calibrated edge threshold in seriel monitor for troubleshooting purpose.
    */
    //% group="Edge Sensors"
    //% weight=74
    //% blockGap=8
    //% blockId=sumobit_edge_calibrated_threshold_serial
    //% block="calibrated edge threshold"
    //% blockHidden=true
    export function fetchCalibratedEdgeThreshold(): void {
    serial.writeString("Left: ")
    serial.writeNumber(sumobitLeftThreshold)
    serial.writeString(" Right: ")
    serial.writeNumber(sumobitRightThreshold)
    serial.writeLine("")

}

    /**
    * Compare.
    */
    //% group="Edge Sensors"
    //% weight=73
    //% blockGap=8
    //% blockId=sumobit_edge_compare_calibrated_value
    //% block="%edge edge detected"
    export function compareEdgeCalibrated(edge: SumobitEdgeSelection): boolean {
    
    let result = false;
    switch (edge) {
        case SumobitEdgeSelection.Right:
            if (sumobitRightEdgeValue < sumobitRightThreshold) {
                result = true;
            }
            break;

        case SumobitEdgeSelection.Left:
            if (sumobitLeftEdgeValue < sumobitLeftThreshold) {
                result = true;
            }
            break;
    }
    return result;

    }

}