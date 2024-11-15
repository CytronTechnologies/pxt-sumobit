/*******************************************************************************
 * Functions for SUMO:BIT motor control
 *
 * Company: Cytron Technologies Sdn Bhd
 * Website: http://www.cytron.io
 * Email:   support@cytron.io
 *******************************************************************************/



// Motor direction.
enum SumobitMotorDirection {

    //% block="forward"
    Forward = 0,

    //% block="backward"
    Backward = 1
};

// Motor channel.
enum SumobitMotorChannel {

    //% block="right"
    RightMotor = 0,

    //% block="left"
    LeftMotor = 1,

    //% block="both"
    Both = 1000,
};

namespace sumobit {

    /**
     * Stop motor
     * @param motor Motorchannel eg: SumobitMotorChannel.RightMotor
     */
    //% group="DC Motors"
    //% weight=98
    //% blockGap=8
    //% blockId=sumobit_motor_stop
    //% block="stop %motor motor"
    export function stopMotor(motor: SumobitMotorChannel): void {
        switch (motor) {
            case SumobitMotorChannel.RightMotor:
                sumobit.i2cWrite(REG_ADD_PWM1, 0);
                sumobit.i2cWrite(REG_ADD_DIR1, 0);
                break;

            case SumobitMotorChannel.LeftMotor:
                sumobit.i2cWrite(REG_ADD_PWM2, 0);
                sumobit.i2cWrite(REG_ADD_DIR2, 0);
                break;

            case SumobitMotorChannel.Both:
                sumobit.i2cWrite(REG_ADD_PWM1, 0);
                sumobit.i2cWrite(REG_ADD_DIR1, 0);
                sumobit.i2cWrite(REG_ADD_PWM2, 0);
                sumobit.i2cWrite(REG_ADD_DIR2, 0);
                break;
        }
    }


    /**
     * Run the motor forward or backward.
     * (Speed = 0-255) (Acceleration = 1-9).
     * @param motor Motor channel.
     * @param direction Motor direction.
     * @param speed Motor speed (PWM). eg: 128
     * @param acceleration Acceleration factor (1-9). eg: 9
     */
    //% group="DC Motors"
    //% weight=99
    //% blockGap=8
    //% blockId=sumobit_motor_run
    //% accel.fieldOptions.label="Acceleration Factor"
    //% block="run %motor motor %direction at %speed speed || with %acceleration acceleration factor"
    //% inlineInputMode=inline
    //% speed.min=0 speed.max=255
    //% acceleration.min=1 acceleration.max=9
    //% expandableArgumentMode="enabled"
    
    export function runMotor(motor: SumobitMotorChannel, direction: SumobitMotorDirection, speed: number, acceleration: number = 9): void {
        speed = sumobit.limit(speed, 0, 255);
        acceleration = sumobit.limit(acceleration, 1, 9);
        switch (motor) {
            case SumobitMotorChannel.RightMotor:
                if (direction == SumobitMotorDirection.Forward) {
                    sumobit.i2cWrite(REG_ADD_PWM1, speed);
                    sumobit.i2cWrite(REG_ADD_DIR1, 0);
                    sumobit.i2cWrite(REG_ADD_ACCEL1, acceleration);
                }
                else {
                    sumobit.i2cWrite(REG_ADD_PWM1, speed);
                    sumobit.i2cWrite(REG_ADD_DIR1, 1);
                    sumobit.i2cWrite(REG_ADD_ACCEL1, acceleration);
                }
                break;

            case SumobitMotorChannel.LeftMotor:
                if (direction == SumobitMotorDirection.Forward) {
                    sumobit.i2cWrite(REG_ADD_PWM2, speed);
                    sumobit.i2cWrite(REG_ADD_DIR2, 0);
                    sumobit.i2cWrite(REG_ADD_ACCEL2, acceleration);
                }
                else {
                    sumobit.i2cWrite(REG_ADD_PWM2, speed);
                    sumobit.i2cWrite(REG_ADD_DIR2, 1);
                    sumobit.i2cWrite(REG_ADD_ACCEL2, acceleration);
                }
                break;

            case SumobitMotorChannel.Both:
                if (direction == SumobitMotorDirection.Forward) {
                    sumobit.i2cWrite(REG_ADD_PWM1, speed);
                    sumobit.i2cWrite(REG_ADD_DIR1, 0);
                    sumobit.i2cWrite(REG_ADD_ACCEL1, acceleration);
                    sumobit.i2cWrite(REG_ADD_PWM2, speed);
                    sumobit.i2cWrite(REG_ADD_DIR2, 0);
                    sumobit.i2cWrite(REG_ADD_ACCEL2, acceleration);
                }
                else {
                    sumobit.i2cWrite(REG_ADD_PWM1, speed);
                    sumobit.i2cWrite(REG_ADD_DIR1, 1);
                    sumobit.i2cWrite(REG_ADD_ACCEL1, acceleration);
                    sumobit.i2cWrite(REG_ADD_PWM2, speed);
                    sumobit.i2cWrite(REG_ADD_DIR2, 1);
                    sumobit.i2cWrite(REG_ADD_ACCEL2, acceleration);
                }
                break;
        }
    }

    /**
     * Set individual motors speed (speed = -255 to 255, negative value = reverse). 
     * @param leftSpeed Speed for left motor. eg: 100
     * @param rightSpeed Speed for right motor. eg: 100
     * @param acceleration Speed for right motor. eg: 9
     */
    //% group="DC Motors"
    //% weight=97
    //% blockGap=8
    //% blockId=sumobit_motor_set_speed
    //% block="set motors speed: left %leftSpeed right %rightSpeed || acceleration %acceleration "
    //% leftSpeed.min=-255 leftSpeed.max=255
    //% rightSpeed.min=-255 rightSpeed.max=255
    //% acceleration.min=1 acceleration.max=9
    //% expandableArgumentMode="enabled"
    export function setMotorsSpeed(leftSpeed: number, rightSpeed: number, acceleration: number = 9): void {
        let leftDir = SumobitMotorDirection.Forward;
        let rightDir = SumobitMotorDirection.Forward;

        if (leftSpeed < 0) {
            leftSpeed = -leftSpeed;
            leftDir = SumobitMotorDirection.Backward;
        }

        if (rightSpeed < 0) {
            rightSpeed = -rightSpeed;
            rightDir = SumobitMotorDirection.Backward;
        }
        sumobit.runMotor(0, rightDir, rightSpeed, acceleration);
        sumobit.runMotor(1, leftDir, leftSpeed, acceleration);
    }
        
    
}
