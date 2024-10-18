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
     * @param motor Motorchannel eg: Motor.M1, Motor.M2
     */
    //% group="DC Motors"
    //% weight=98
    //% blockGap=8
    //% blockId=sumobit_brake_motor
    //% block="brake motor %motor"
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
     * Run the motor forward or backward (Speed = 0-255).
     * @param motor Motor channel.
     * @param direction Motor direction.
     * @param speed Motor speed (0-255). eg: 128
     * @param accelaration Acceleration factor (0-9). eg: 0
     */
    //% group="DC Motors"
    //% weight=99
    //% blockGap=8
    //% blockId=sumobit_run_motor
    //% accel.fieldOptions.label="Acceleration Factor"
    //% block="run %motor motor %direction at %speed speed || with %accelaration acceleration factor"
    //% inlineInputMode=inline
    //% speed.min=0 speed.max=255
    //% accelaration.min=0 accelaration.max=9
    //% expandableArgumentMode="enabled"
    
    export function runMotor(motor: MotorChannel, direction: MotorDirection, speed: number, accelaration: number = 0): void {
        speed = sumobit.limit(speed, 0, 255);
        accelaration = sumobit.limit(accelaration, 0, 9);
        switch (motor) {
            case MotorChannel.MR:
                if (direction == MotorDirection.Forward) {
                    sumobit.i2cWrite(REG_ADD_PWM1, speed);
                    sumobit.i2cWrite(REG_ADD_DIR1, 0);
                    sumobit.i2cWrite(REG_ADD_ACCEL1, accelaration);
                }
                else {
                    sumobit.i2cWrite(REG_ADD_PWM1, speed);
                    sumobit.i2cWrite(REG_ADD_DIR1, 1);
                    sumobit.i2cWrite(REG_ADD_ACCEL1, accelaration);
                }
                break;

            case MotorChannel.ML:
                if (direction == MotorDirection.Forward) {
                    sumobit.i2cWrite(REG_ADD_PWM2, speed);
                    sumobit.i2cWrite(REG_ADD_DIR2, 0);
                    sumobit.i2cWrite(REG_ADD_ACCEL2, accelaration);
                }
                else {
                    sumobit.i2cWrite(REG_ADD_PWM2, speed);
                    sumobit.i2cWrite(REG_ADD_DIR2, 1);
                    sumobit.i2cWrite(REG_ADD_ACCEL2, accelaration);
                }
                break;

            case MotorChannel.All:
                if (direction == MotorDirection.Forward) {
                    sumobit.i2cWrite(REG_ADD_PWM1, speed);
                    sumobit.i2cWrite(REG_ADD_DIR1, 0);
                    sumobit.i2cWrite(REG_ADD_ACCEL1, accelaration);
                    sumobit.i2cWrite(REG_ADD_PWM2, speed);
                    sumobit.i2cWrite(REG_ADD_DIR2, 0);
                    sumobit.i2cWrite(REG_ADD_ACCEL2, accelaration);
                }
                else {
                    sumobit.i2cWrite(REG_ADD_PWM1, speed);
                    sumobit.i2cWrite(REG_ADD_DIR1, 1);
                    sumobit.i2cWrite(REG_ADD_ACCEL1, accelaration);
                    sumobit.i2cWrite(REG_ADD_PWM2, speed);
                    sumobit.i2cWrite(REG_ADD_DIR2, 1);
                    sumobit.i2cWrite(REG_ADD_ACCEL2, accelaration);
                }
                break;
        }
    }


}
