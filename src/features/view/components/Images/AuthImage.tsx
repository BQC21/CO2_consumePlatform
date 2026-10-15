import Image from "next/image";

export function AuthImage() {
    return <Image 
        src="/instalacion-lagunaSeca52-edit.jpg" 
        alt="Imagen para decorar la vista de autenticación" 
        fill 
        priority 
        sizes="50vw"
        className="object-cover"
    />;
}