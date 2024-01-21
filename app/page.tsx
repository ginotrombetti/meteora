import Image from "next/image";
import NavHeader from "@/app/components/NavHeader/NavHeader";
import MainStage from "@/app/components/MainStage/MainStage";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <NavHeader></NavHeader>
      <MainStage></MainStage>
    </main>
  );
}
