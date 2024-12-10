import React, {useState, useEffect, ChangeEvent} from "react"

interface Time {
    hours: string
    minutes: string
    seconds: string
}

interface CustomTimeInputProps {
    id: string
    value: string
    onChange: (time: string) => void
    nullable: boolean
}

const CustomTimeInput: React.FC<CustomTimeInputProps> = ({id, value, onChange, nullable = false}) => {
    const parseTime = (timeString: string): Time => {
        const [hours = "", minutes = "", seconds = ""] = timeString.split(":")
        return {hours, minutes, seconds}
    };

    const [time, setTime] = useState<Time>(parseTime(value))
    const [error, setError] = useState<string>("")

    useEffect(() => {
        if (value) setTime(parseTime(value))
    }, [value])

    const validate = (newTime: Time): boolean => {
        if (!nullable && !newTime.hours && !newTime.minutes && !newTime.seconds) {
            setError(`${id} cannot be empty`)
            return false
        }

        setError("")
        return true
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const {name, value} = e.target
        const numericValue = value.replace(/\D/g, "")

        if ((name === "minutes" || name === "seconds") && Number(numericValue) > 59) return

        const newTime = {...time, [name]: numericValue}
        setTime(newTime)

        const formattedTime = `${newTime.hours || "00"}:${newTime.minutes || "00"}:${newTime.seconds || "00"}`
        if (validate(newTime) && onChange) onChange(formattedTime)
    }

    const handleBlur = (): void => {
        validate(time)
    }

    return (
        <div>
            <div className="custom-time-input p-2 flex items-center w-full border border-gray-300 rounded-md bg-white focus-within:border-black focus-within:border-2">
                <input
                    type="text"
                    name="hours"
                    value={time.hours}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="HH"
                    className="time-field border-none outline-none text-center w-8 text-sm placeholder-gray-400 bg-transparent"
                />
                <span className="text-base leading-none px-1">:</span>
                <input
                    type="text"
                    name="minutes"
                    value={time.minutes}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="MM"
                    className="time-field border-none outline-none text-center w-8 text-sm placeholder-gray-400 bg-transparent"
                />
                <span className="text-base leading-none px-1">:</span>
                <input
                    type="text"
                    name="seconds"
                    value={time.seconds}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="SS"
                    className="time-field border-none outline-none text-center w-8 text-sm placeholder-gray-400 bg-transparent"
                />
            </div>
            {error && <div className="error-message text-red-500 text-sm mt-1">{error}</div>}
        </div>
    )
}

export default CustomTimeInput