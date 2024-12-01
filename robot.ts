/*******************************************************************************
 * Functions for SUMO:BIT robot
 *
 * Company: Cytron Technologies Sdn Bhd
 * Website: http://www.cytron.io
 * Email:   support@cytron.io
 *******************************************************************************/

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

enum SumobitSearch {
    //% block="normal"
    Normal = 0,

    //% block="defense"
    Defense = 1,
};


namespace sumobit {

    let initialSpeed: number;
    let searchDirection: number = -1;
    let searchMillis = control.millis();

    /**
     * Motor speed initialization
     * @param speed Intitial Robot Speed eg: 255
     */
    //% group="Robot Kit"
    //% weight=19
    //% blockGap=8
    //% blockId="sumobit_robot_initial_speed"
    //% block="set robot speed %speed"
    //% speed.min=0 speed.max=255
    //% second.fieldOptions.decompileLiterals=true
    //% subcategory="Robot Kit"
    //% blockHidden=true
    export function setSpeed(speed: number): void {
        speed = initialSpeed;
    }

    /**
     * Start LED matrix countdown (5 or 3 second)
     * @param second Countdown Second eg: SumobitCountdown.Five
     */
    //% group="Robot Kit"
    //% weight=18
    //% blockGap=8
    //% blockId="sumobit_robot_countdown"
    //% block="start countdown %second"
    //% second.fieldOptions.decompileLiterals=true
    //% subcategory="Robot Kit"
    export function countdown(second: SumobitCountdown): void {
        let startTime = control.millis();

        while (control.millis() - startTime < (second - 1) * 1000) {
            basic.showNumber(second - Math.round((control.millis() - startTime) / 1000))
            basic.pause(210)
        }
    }

    /**
     * Preset backoff routine
     * @param direction Backoff turn direction eg: SumobitDirection.Right
     * @param speed Motor speed when reverse and turn (0-255). eg: 120
     * @param acceleration Motor acceleration factor (1-9). eg: 9
     */
    //% group="Robot Kit"
    //% weight=17
    //% blockGap=8
    //% blockId="sumobit_robot_backoff"
    //% block="backoff %direction speed:%speed || acceleration:%acceleration"
    //% expandableArgumentMode="toggle"
    //% speed.min=0 speed.max=255
    //% acceleration.min=1 acceleration.max=9
    //% second.fieldOptions.decompileLiterals=true
    //% subcategory="Robot Kit"

    export function backoff(direction: SumobitDirection, speed: number = 120, acceleration: number = 9): void {

        //stop motor
        sumobit.stopMotor(1000)
        basic.pause(50)
        //reverse 
        sumobit.setMotorsSpeed(speed * -1, speed * -1, acceleration)
        basic.pause(350 - speed)

        //rotate robot
        switch (direction) {
            case SumobitDirection.Right:
                searchDirection = 1;
                sumobit.setMotorsSpeed(speed * 1, speed * -1, 9);
                break;

            case SumobitDirection.Left:
                searchDirection = -1;
                sumobit.setMotorsSpeed(speed * -1, speed * 1, 9);
                break;
        }
        basic.pause(380 - speed)
        sumobit.stopMotor(1000)
        basic.pause(50)
    }

    /**
     * Attack routine
     * @param speed Motor speed when Front Cenre detects opponent (0-255). eg: 120
     * @param acceleration Motor acceleration factor (1-9). eg: 9
     */
    //% group="Robot Kit"
    //% weight=16
    //% blockGap=8
    //% blockId="sumobit_robot_attack"
    //% block="attack speed:%speed || acceleration:%acceleration"
    //% expandableArgumentMode="toggle"
    //% speed.min=0 speed.max=255
    //% acceleration.min=1 acceleration.max=9
    //% second.fieldOptions.decompileLiterals=true
    //% subcategory="Robot Kit"

    export function attack(speed: number = 120, acceleration: number = 9): void {

        // Opponent in Front Centre
        if (oppSensorDetection(2)) {
            sumobit.setMotorsSpeed(speed, speed, acceleration)
        }
        // Opponent in Front Right
        else if (oppSensorDetection(3)) {
            sumobit.setMotorsSpeed(255, 0, 9)
        }
        // Opponent in Front Left
        else if (oppSensorDetection(1)) {
            sumobit.setMotorsSpeed(0, 255, 9)
        }
        // Opponent at Right
        else if (oppSensorDetection(4)) {
            sumobit.setMotorsSpeed(255, -255, 9)
        }
        // Opponent at Left
        else if (oppSensorDetection(0)) {
            sumobit.setMotorsSpeed(-255, 255, 9)
        }
    }

    /**
    * Robot search routine
    * @param mode Robot search movement when no opponent is detected eg: SumobitSearch(0)
    * @param speed Motor speed when Front Cenre detects opponent (0-255). eg: 120
    * @param acceleration Motor acceleration factor (1-9). eg: 9
    */
    //% group="Robot Kit"
    //% weight=15
    //% blockGap=8
    //% blockId="sumobit_robot_search"
    //% block="search %mode speed:%speed || acceleration:%acceleration"
    //% speed.min=0 speed.max=255
    //% acceleration.min=1 acceleration.max=9
    //% second.fieldOptions.decompileLiterals=true
    //% subcategory="Robot Kit"
    //% expandableArgumentMode="toggle"
    export function search(mode: SumobitSearch, speed: number = 120, acceleration: number = 9): void {

        switch (mode) {

            case SumobitSearch.Normal:
                if (searchDirection = 1) {
                    // curve to right
                    sumobit.setMotorsSpeed(speed, speed * 0.85, acceleration)
                }
                else if (searchDirection = -1) {
                    // curve to left
                    sumobit.setMotorsSpeed(speed * 0.85, speed, acceleration)
                }
                break;

            case SumobitSearch.Defense:
                if (control.millis() - searchMillis > 4500) {
                    sumobit.setMotorsSpeed(speed, speed, acceleration)
                    basic.pause(50)
                    searchMillis = control.millis()
                }
                else {
                    sumobit.stopMotor(1000)
                }
                break;
        }
    }
} // namespace