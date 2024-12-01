/**
 * Board initialization and helper function.
 */

// I2C slave address for RP2040
const SUMOBIT_I2C_ADDRESS = 0x09;

// I2C register addresses
const REG_ADD_REVISION = 0;
const REG_ADD_SRV1_POS = 1;
const REG_ADD_SRV1_SPEED = 2;
const REG_ADD_SRV2_POS = 3;
const REG_ADD_SRV2_SPEED = 4;
const REG_SERVO_R1 = 5;
const REG_SERVO_R2 = 6;
const REG_SERVO_R3 = 7;
const REG_SERVO_R4 = 8;
const REG_ADD_PWM1 = 9;
const REG_ADD_DIR1 = 10;
const REG_ADD_ACCEL1 = 11;
const REG_ADD_PWM2 = 12;
const REG_ADD_DIR2 = 13;
const REG_ADD_ACCEL2 = 14;
const REG_MOTOR_R1 = 15;
const REG_MOTOR_R2 = 16;
const REG_MOTOR_R3 = 17;
const REG_MOTOR_R4 = 18;
const REG_ADD_R0 = 19;
const REG_ADD_G0 = 20;
const REG_ADD_B0 = 21;
const REG_ADD_R1 = 22;
const REG_ADD_G1 = 23;
const REG_ADD_B1 = 24;
const REG_ADD_AN1_HIGH = 25;
const REG_ADD_AN1_LOW = 26;
const REG_ADD_AN2_HIGH = 27;
const REG_ADD_AN2_LOW = 28;
const REG_CURRENT_R1 = 29;
const REG_CURRENT_R2 = 30;
const REG_ADD_VIN_HIGH = 31;
const REG_ADD_VIN_LOW = 32;
const REG_VIN_R1 = 33;
const REG_VIN_R2 = 34;
const REG_ADD_DIP = 35;
const REG_ADD_RESET = 36;

/**
* Blocks for SUMO:BIT.
*/

//% weight=10 color=#ff8000 icon="\uf091" block="SUMO:BIT"
//% groups=['DC Motors', 'Servos' , 'Mode', 'Motor Current','Opponent Sensors' , 'Edge Sensors', 'RGB LED']
namespace sumobit {

    
    // Stop all motor initially
    sumobit.i2cWrite(REG_ADD_PWM1, 0);
    sumobit.i2cWrite(REG_ADD_PWM2, 0);

    // Disable the servos initially
    sumobit.i2cWrite(ServoChannel.Servo1, 0);
    sumobit.i2cWrite(ServoChannel.Servo2, 0);
    

    /**
     * Limit the range of a number.
     * @param value The number we want to limit.
     * @param min Minimum value of the number.
     * @param max Maximum value of the number.
     */
    //% blockHidden=true
    //% blockId=sumobit_limit
    export function limit(value: number, min: number, max: number): number {
        if (value < min) {
            value = min;
        }
        else if (value > max) {
            value = max;
        }
        return value;
    }


    /**
     * I2C read from the register of RP2040.
     * @param register Register address.
     */
    //% blockHidden=true
    //% blockId=sumobit_i2c_read
    export function i2cRead(register: number): number {
        let value = 0;
        pins.i2cWriteNumber(SUMOBIT_I2C_ADDRESS, register, NumberFormat.UInt8LE, true);
        value = pins.i2cReadNumber(SUMOBIT_I2C_ADDRESS, NumberFormat.UInt8LE);
        return value;
    }


    /**
     * I2C write to the register of RP2040.
     * @param register Register address.
     * @param data Data to write.
     */
    //% blockHidden=true
    //% blockId=sumobit_i2c_write
    export function i2cWrite(register: number, data: number): void {
        let buffer = pins.createBuffer(2);
        buffer[0] = register;
        buffer[1] = data;
        pins.i2cWriteBuffer(SUMOBIT_I2C_ADDRESS, buffer);
    }


}