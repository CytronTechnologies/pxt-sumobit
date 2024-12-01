/*******************************************************************************
 * Functions for SUMO:BIT servo control
 *
 * Company: Cytron Technologies Sdn Bhd
 * Website: http://www.cytron.io
 * Email:   support@cytron.io
 *******************************************************************************/



// Servo Channel.
enum SumobitServoChannel {
    
    //% block="servo 1"
    Servo1 = 1,
    
    //% block="servo 2"
    Servo2 = 2,

    //% block="all"
    All = 1000,
};


namespace sumobit{

    /**
     * Disable servo.
     * @param servo The servo to control. eg:SumobitServoChannel.Servo1
     */
    //% group="Servos"
    //% weight=38
    //% blockGap=8
    //% blockId=sumobit_servo_disable
    //% block="disable servo %servo"
    //% servo.defl=1
    export function disableServo(servo: SumobitServoChannel): void {

        switch (servo) {
            case SumobitServoChannel.Servo1:
                setServoPosition(1, 0, 9);
                break;

            case SumobitServoChannel.Servo2:
                setServoPosition(2, 0, 9);
                break;

            case SumobitServoChannel.All:
                setServoPosition(1000, 0, 9);
                break;
        }
    }


    /**
     * Set the position for servo (0-180 degrees).
     * @param servo The servo to control. eg: SumobitServoChannel.Servo1
     * @param position The desired angle of the servo. eg: 90
     * @param speed Servo movement speed. Higher values result in faster movement. eg:9
     */
    //% group="Servos"
    //% weight=39
    //% blockGap=8
    //% blockId=sumobit_servo_set_position
    //% block="set %servo position to %position \\° || at speed:%speed"
    //% servo.defl=1
    //% position.min=0 position.max=180
    //% position.defl=90
    //% speed.min=0 position.max=180
    //% speed.defl=9
    export function setServoPosition(servo: SumobitServoChannel, position: number, speed:number=9): void {
        position = sumobit.limit(position, 0, 180);

        switch (servo) {
            case SumobitServoChannel.Servo1:
                sumobit.i2cWrite(REG_ADD_SRV1_POS, position);
                sumobit.i2cWrite(REG_ADD_SRV1_SPEED, speed);
                break;

            case SumobitServoChannel.Servo2:
                sumobit.i2cWrite(REG_ADD_SRV2_POS, position);
                sumobit.i2cWrite(REG_ADD_SRV2_SPEED, speed);
                break;

            case SumobitServoChannel.All:
                sumobit.i2cWrite(REG_ADD_SRV1_POS, position);
                sumobit.i2cWrite(REG_ADD_SRV2_POS, position);
                sumobit.i2cWrite(REG_ADD_SRV1_SPEED, speed);
                sumobit.i2cWrite(REG_ADD_SRV2_SPEED, speed);
                break;
        }
    }


}
