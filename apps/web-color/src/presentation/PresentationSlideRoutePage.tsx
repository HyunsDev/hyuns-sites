import { useParams } from "@tanstack/react-router"

import { PresentationDeckPage } from "@/presentation/PresentationDeckPage"

export function PresentationSlideRoutePage() {
  const { slideId } = useParams({ from: "/presentation/$slideId" })

  return <PresentationDeckPage requestedSlideId={slideId} />
}
