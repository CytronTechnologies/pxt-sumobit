/*******************************************************************************
 * Functions for SUMO:BIT motor control
 *
 * Company: Cytron Technologies Sdn Bhd
 * Website: http://www.cytron.io
 * Email:   support@cytron.io
 *******************************************************************************/



// Motor direction.
enum MotorDirection {
    //% block="forward"
    Forward = 0,

    //% block="backward"
    Backward = 1
};

namespace sumobit {

// Motor channel.
export enum MotorChannel {
    
    //% block="right"
    MR = 0,

    //% block="left"
    ML = 1,

    //% block="both"
    All = 1000,
};


    /**
     * Stop motor
     * @param motor Motorchannel eg: Motor.M1
     */
    //% group="DC Motors"
    //% weight=98
    //% blockGap=8
    //% blockId=sumobit_motor_brake
    //% block="brake %motor motor"
    export function brakeMotor(motor: MotorChannel): void {
        switch (motor) {
            case MotorChannel.MR:
                sumobit.i2cWrite(REG_ADD_PWM1, 0);
                sumobit.i2cWrite(REG_ADD_DIR1, 0);
                break;

            case MotorChannel.ML:
                sumobit.i2cWrite(REG_ADD_PWM2, 0);
                sumobit.i2cWrite(REG_ADD_DIR2, 0);
                break;

            case MotorChannel.All:
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
     * @param acceleration Acceleration factor (1-9). eg: 4
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
    
    export function runMotor(motor: MotorChannel, direction: MotorDirection, speed: number, acceleration: number = 4): void {
        speed = sumobit.limit(speed, 0, 255);
        acceleration = sumobit.limit(acceleration, 1, 9);
        switch (motor) {
            case MotorChannel.MR:
                if (direction == MotorDirection.Forward) {
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

            case MotorChannel.ML:
                if (direction == MotorDirection.Forward) {
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

            case MotorChannel.All:
                if (direction == MotorDirection.Forward) {
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
     * @param leftSpeed Speed for left motor. eg: 0
     * @param rightSpeed Speed for right motor. eg: 0
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
    export function setMotorsSpeed(leftSpeed: number, rightSpeed: number, acceleration: number = 4): void {
        let leftDir = MotorDirection.Forward;
        let rightDir = MotorDirection.Forward;

        if (leftSpeed < 0) {
            leftSpeed = -leftSpeed;
            leftDir = MotorDirection.Backward;
        }

        if (rightSpeed < 0) {
            rightSpeed = -rightSpeed;
            rightDir = MotorDirection.Backward;
        }
        sumobit.runMotor(0, rightDir, rightSpeed, acceleration);
        sumobit.runMotor(1, leftDir, leftSpeed, acceleration);
    }
        
        

    


}
