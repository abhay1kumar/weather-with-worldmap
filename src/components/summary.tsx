import Image from "next/image";

interface Summary {
    icon: string,
    title: string,
    description: string
}


const Summary: React.FC<Partial<Summary>> = ({
    icon = "",
    title = "",
    description = ""
}) => (
    <div>
        <Image className="m-auto" height="60" width="60" src={`http://openweathermap.org/img/w/${icon}.png`} alt={description} />
        <figcaption className="text-lg">{title}</figcaption>
        <span>{description}</span>
    </div>
)

export default Summary;