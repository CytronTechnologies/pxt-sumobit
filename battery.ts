/*******************************************************************************
 * Function for SUMO:BIT battery input
 *
 * Company: Cytron Technologies Sdn Bhd
 * Website: http://www.cytron.io
 * Email:   support@cytron.io
 *******************************************************************************/

namespace sumobit {

    /**
    * Get the current battery voltage (2 d.p.).
    */
    //% group="Battery"
    //% weight=49
    //% blockGap=8
    //% blockId=sumobit_battery_read
    //% block="battery voltage"
    export function readBatteryValue(): number {
        let highByte: number;
        let lowByte: number;
        highByte = sumobit.i2cRead(SUMOBIT_REG_ADD_VIN_HIGH);
        lowByte = sumobit.i2cRead(SUMOBIT_REG_ADD_VIN_LOW);
        return ((highByte << 8) | lowByte) / 100;
    }
}
