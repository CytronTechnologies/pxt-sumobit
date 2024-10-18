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

// Edge sensor side
enum EdgeSide {
    
    //% block="right"
    Right = 0,
    //% block="left"
    Left = 1,

    //% block="both"
    Both = 1000
}

// Comparison type.
enum EdgeCompareType {
    //% block=">"
    MoreThan = 0,

    //% block="<"
    LessThan = 1
}

namespace sumobit {

    /**
      * Return the right edge sensor value (0-1023).
      */
    //% group="Edge Sensors"
    //% weight=79
    //% blockGap=8
    //% blockId=sumobit_read_edge_R_value
    //% block="right edge sensor"
    export function readEdgeRValue(): number {
        return pins.analogReadPin(EDGE_R_PIN);
    }

    /**
      * Return the left edge sensor value (0-1023).
      */
    //% group="Edge Sensors"
    //% weight=78
    //% blockGap=8
    //% blockId=sumobit_read_edge_L_value
    //% block="left edge sensor"
    export function readEdgeLValue(): number {
        return pins.analogReadPin(EDGE_L_PIN);
    }


    /**
    * Compare the edge sensor(s) value (0-1023) with certain value and return true if condition is meet.
    * @param EdgeSide Which side of edge sensors are to compare to. eg: 0
    * @param compareType More than or less than. eg: 0
    * @param threshold The value to compare with. eg: 512
    */
    //% group="Edge Sensors"
    //% weight=77
    //% blockGap=40
    //% blockId=sumobit_compare_edge_value
    //% block="%side edge sensor %compareType %threshold"
    //% threshold.min=0 threshold.max=1023
    export function compareEdge(side: EdgeSide, compareType: EdgeCompareType, threshold: number,): boolean {

        let result = false;
        let R = readEdgeRValue();
        let L = readEdgeLValue();


        switch (side) {
            case EdgeSide.Right:
                if ((R > threshold && EdgeCompareType.MoreThan) || (R < threshold && EdgeCompareType.LessThan)) {
                    result = true;
                }
                break;

            case EdgeSide.Left:
                if ((L > threshold && EdgeCompareType.MoreThan) || (L < threshold && EdgeCompareType.LessThan)) {
                    result = true;
                }
                break;

            case EdgeSide.Both:
                if (((R > threshold && L > threshold) && EdgeCompareType.MoreThan) || ((R > threshold && L > threshold) && EdgeCompareType.LessThan)) {
                    result = true;
                }
                break;
        }

        return result;

    }
}