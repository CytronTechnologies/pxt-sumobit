/*******************************************************************************
 * Functions for SUMO:BIT robot
 *
 * Company: Cytron Technologies Sdn Bhd
 * Website: http://www.cytron.io
 * Email:   support@cytron.io
 *******************************************************************************/

let sumobitInitialSpeed: number;


enum SumobitCountdown {

    //% block="3 seconds"
    Three = 3,

    //% block="5 seconds"
    Five = 5,

};

enum SumobitDirection {

    //% block="left"
    Left = 0,

    //% block="right"
    Right = 1,

};

enum SumobitTesting {

    //% block="testing"
    Test = 0,

    //% block="game"
    Game = 1,

};

namespace sumobit {

    /**
     * Motor speed initialization
     * * @param speed Intitial Robot Speed eg: 255
     */
    //% group="Robot Kit"
    //% weight=19
    //% blockGap=8
    //% blockId="sumobit_robot_initial_speed"
    //% block="set robot speed %speed"
    //% speed.min=0 speed.max=255
    //% second.fieldOptions.decompileLiterals=true
    //% advanced=true
    export function setSpeed(speed: number): void {
        speed = sumobitInitialSpeed;
    }

    /**
     * Start LED matrix countdown (5 or 3 second)
     * * @param second Countdown Second eg: SumobitCountdown.Five
     */
    //% group="Robot Kit"
    //% weight=18
    //% blockGap=8
    //% blockId="sumobit_robot_countdown"
    //% block="start countdown %second"

    //% second.fieldOptions.decompileLiterals=true
    //% advanced=true
    export function countdown(second: SumobitCountdown): void {
        let startTime = control.millis();

        while (control.millis() - startTime < (second - 1) * 1000) {
            basic.showNumber(second - Math.round((control.millis() - startTime) / 1000))
            basic.pause(210)
        }

    }

    /**
     * Preset backoff routine
     * * @param direction Backoff turn direction eg: SumobitDirection.Right
     */
    //% group="Robot Kit"
    //% weight=17
    //% blockGap=8
    //% blockId="sumobit_robot_backoff"
    //% block="backoff %direction"
    //% second.fieldOptions.decompileLiterals=true
    //% advanced=true
    export function backoff(direction: SumobitDirection): void {
        let speed = sumobitInitialSpeed
        //stop motor
        sumobit.stopMotor(1000)
        basic.pause(50)
        //reverse
        sumobit.setMotorsSpeed(speed / -1, speed / -1, 9)
        basic.pause(350 - speed)

        switch (direction) {
            case SumobitDirection.Right:
                sumobit.setMotorsSpeed(speed / -1, speed / 1, 9);
            case SumobitDirection.Left:
                sumobit.setMotorsSpeed(speed / 1, speed / -1, 9);
        }
        basic.pause(380 - speed)
        sumobit.stopMotor(1000)
        basic.pause(50)

    }

    /**
     * Attack routine for testing or game
     * * @param 
     */
    //% group="Robot Kit"
    //% weight=16
    //% blockGap=8
    //% blockId="sumobit_robot_attack"
    //% block="attack %mode"
    //% second.fieldOptions.decompileLiterals=true
    //% advanced=true
    export function attack(mode: SumobitTesting): void {
        let speed = sumobitInitialSpeed

    }



}