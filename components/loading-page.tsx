import { CircleEllipsis, HeartCrack, Loader, Loader2, LoaderIcon } from "lucide-react";

export default function LoadingComponent() {
    return (
        <>
            <div className="fixed top-0 bg-background w-full h-full flex items-center justify-center">
                <div className="grid grid-cols-1 grid-rows-4 gap-4 p-4  h-full justify-center">
                    <div className="flex items-end justify-center row-span-2 ">
                        <img width={360} src="https://cdn.discordapp.com/attachments/1155990923801526293/1258850880283742348/semfundobranco.png?ex=66ad243e&is=66abd2be&hm=a19c0f21ba998759fca5c692c8535144d1d53a7230cf17d293ed778e23218cca&" alt="" />
                    </div>
                    <div className="flex items-start justify-center row-span-2 ">
                        <Loader2 size="42" className="animate-spin"/>
                    </div>
                </div>
                <div className="fixed bottom-0 w-full h-[80px] flex items-center justify-center">
                    <h1><a className="font-bold"> C2P </a></h1>
                </div>
            </div>
        </>
    )
 }