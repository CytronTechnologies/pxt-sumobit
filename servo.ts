/*******************************************************************************
 * Functions for SUMO:BIT servo control
 *
 * Company: Cytron Technologies Sdn Bhd
 * Website: http://www.cytron.io
 * Email:   support@cytron.io
 *******************************************************************************/

// Servo Channel.
enum ServoChannel {
    
    //% block="servo 1"
    Servo1 = REG_ADD_SRV1_POS,
    
    //% block="servo 2"
    Servo2 = REG_ADD_SRV2_POS,

    //% block="all"
    All = 1000,
};

namespace sumobit{

    /**
     * Disable servo.
     * @param servo Servo channel.
     */
    //% group="Servos"
    //% weight=38
    //% blockGap=8
    //% blockId=sumobit_servo_disable
    //% block="disable servo %servo"
    
    export function disableServo(servo: ServoChannel): void {
        if (servo == ServoChannel.All) {
            sumobit.i2cWrite(ServoChannel.Servo1, 0);
            sumobit.i2cWrite(ServoChannel.Servo2, 0);
        }
        else {
            sumobit.i2cWrite(servo, 0);
        }
    }


    /**
     * Set the position for servo (0-180 degrees).
     * @param servo Servo channel. eg: ServoChannel.Servo1
     * @param position Servo positon. eg: 90
     */
    //% group="Servos"
    //% weight=39
    //% blockGap=8
    //% blockId=sumobit_servo_set_position
    //% block="set %servo position to %position \\° || at speed:%speed"
    //% position.min=0 position.max=180 
    
    export function setServoPosition(servo: ServoChannel, position: number, speed:number=9): void {
        position = sumobit.limit(position, 0, 180);

        if (servo == ServoChannel.All) {
            sumobit.i2cWrite(REG_ADD_SRV1_POS, position);
            sumobit.i2cWrite(REG_ADD_SRV2_POS, position);
            sumobit.i2cWrite(REG_ADD_SRV1_SPEED, position);
            sumobit.i2cWrite(REG_ADD_SRV1_SPEED, position);
            
        }
        else {
            sumobit.i2cWrite(servo, position);
        }
    }
}
