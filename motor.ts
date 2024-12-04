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
     * @param motor The motor to control. eg: SumobitMotorChannel.Both
     */
    //% group="DC Motors"
    //% weight=98
    //% blockGap=8
    //% blockId=sumobit_motor_stop
    //% block="stop %motor motor"
    //%  motor.defl=SumobitMotorChannel.Both
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
     * Run the motor forward or backward (Speed = 0-255) (Acceleration = 1-9).
     * @param motor The motor to control. eg: SumobitMotorChannel.Both
     * @param direction The direction of rotation (Forward or Backward). eg: SumobitMotorDirection.Forward
     * @param speed The Motor speed (PWM). eg: 120
     * @param acceleration Acceleration factor, higher value results in a faster rate of speed change (1-9). eg: 9
     */
    //% group="DC Motors"
    //% weight=99
    //% blockGap=8
    //% blockId=sumobit_motor_run
    //% accel.fieldOptions.label="Acceleration Factor"
    //% block="run %motor motor %direction at %speed speed || with %acceleration acceleration factor"
    //% inlineInputMode=inline
    //% motor.defl=SumobitMotorChannel.Both
    //% direction.defl=SumobitMotorDirection.Forward
    //% speed.min=0 speed.max=255
    //% speed.defl=120
    //% acceleration.min=1 acceleration.max=9
    //% acceleration.defl=9
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
     * Set the speed and direction of both motors independently (speed = -255 to 255, negative value = reverse).
     * @param leftSpeed The desired speed of the left motor. eg: 120
     * @param rightSpeed The desired speed of the right motor. eg: 120
     * @param acceleration Acceleration factor, higher value results in a faster rate of speed change (1-9). eg: 9
     */
    //% group="DC Motors"
    //% weight=97
    //% blockGap=8
    //% blockId=sumobit_motor_set_speed
    //% block="set motors speed: left %leftSpeed right %rightSpeed || acceleration %acceleration "
    //% leftSpeed.min=-255 leftSpeed.max=255
    //% leftSpeed.defl=120
    //% rightSpeed.min=-255 rightSpeed.max=255
    //% rightSpeed.defl=120
    //% acceleration.min=1 acceleration.max=9
    //% acceleration.defl=9
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
