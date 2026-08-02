eu necessito no momento atualizar o componente de carousel do zard/ui, a ideia seria atualizar ele utilizando o design atual do componente "original" do shadcn/ui,
a ideia nao e apenas atualizar o componente mas tambem atualizar seus exemplos e api table, para que se encaixe com o padrao completo do projeto ja que realizamos
diversas mudancas, a ideia aqui e conseguir seguir de forma completa por tanto voce devera inicialmente analisar o componente atual do zard e depois da uma olhada aqui
no codigo adicionado para que seja mais claro para voce como seguir passo a passo.

primeiramente o caminho do arquivo completo para o gerenciamento do carousel.ts seria esse aqui:
C:\Users\ReckD\OneDrive\Documentos\GitHub\pessoal\zardui\libs\zard\src\lib\shared\components\carousel\demo\carousel.ts

no carousel.ts voce tem titulo, descricao e etc a ideia e garantir uma facilidade minima no desenvolvimento de novas coisas, agora a lista de solicitacoes para esse update:

1. comparar o componente atual com a sua versao "original" do shadcn/ui, a pricipio o principal aqui e comparar as classes do tailwind, pois algumas sao bem necessarias serem atualizadas, segue abaixo o codigo fonte do componente do shadcn/ui:

```
"use client"

import * as React from "react"
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

function Carousel({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & CarouselProps) {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    },
    plugins
  )
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(false)

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) return
    setCanScrollPrev(api.canScrollPrev())
    setCanScrollNext(api.canScrollNext())
  }, [])

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev()
  }, [api])

  const scrollNext = React.useCallback(() => {
    api?.scrollNext()
  }, [api])

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        scrollPrev()
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        scrollNext()
      }
    },
    [scrollPrev, scrollNext]
  )

  React.useEffect(() => {
    if (!api || !setApi) return
    setApi(api)
  }, [api, setApi])

  React.useEffect(() => {
    if (!api) return
    onSelect(api)
    api.on("reInit", onSelect)
    api.on("select", onSelect)

    return () => {
      api?.off("select", onSelect)
    }
  }, [api, onSelect])

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api: api,
        opts,
        orientation:
          orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <div
        onKeyDownCapture={handleKeyDown}
        className={cn("relative", className)}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  )
}

function CarouselContent({ className, ...props }: React.ComponentProps<"div">) {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div
      ref={carouselRef}
      className="overflow-hidden"
      data-slot="carousel-content"
    >
      <div
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  )
}

function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
  const { orientation } = useCarousel()

  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  )
}

function CarouselPrevious({
  className,
  variant = "outline",
  size = "icon-sm",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      className={cn(
        "absolute touch-manipulation rounded-full",
        orientation === "horizontal"
          ? "top-1/2 -left-12 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ChevronLeftIcon className="cn-rtl-flip" />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
}

function CarouselNext({
  className,
  variant = "outline",
  size = "icon-sm",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      data-slot="carousel-next"
      variant={variant}
      size={size}
      className={cn(
        "absolute touch-manipulation rounded-full",
        orientation === "horizontal"
          ? "top-1/2 -right-12 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ChevronRightIcon className="cn-rtl-flip" />
      <span className="sr-only">Next slide</span>
    </Button>
  )
}

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  useCarousel,
}
```

2. atualizar a descricao da tela, para agora ser: "A carousel with motion and swipe built using Embla."
3. adicionar o exemplo preview, que vai seguir essa estrutura que ja esta na tipagem do projeto:

```
  preview: {
    name: 'preview',
    component: ZardDemoCarouselPreviewComponent,
    column: false,
    codeData: Carousel_DEMO_PREVIEW,
  },
```

e dai o exemplo deve ser portado desse daqui do shadcn/ui:

```
import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
 Carousel,
 CarouselContent,
 CarouselItem,
 CarouselNext,
 CarouselPrevious,
} from "@/components/ui/carousel"

export function CarouselDemo() {
 return (
   <Carousel className="w-full max-w-[12rem] sm:max-w-xs">
     <CarouselContent>
       {Array.from({ length: 5 }).map((_, index) => (
         <CarouselItem key={index}>
           <div className="p-1">
             <Card>
               <CardContent className="flex aspect-square items-center justify-center p-6">
                 <span className="text-4xl font-semibold">{index + 1}</span>
               </CardContent>
             </Card>
           </div>
         </CarouselItem>
       ))}
     </CarouselContent>
     <CarouselPrevious />
     <CarouselNext />
   </Carousel>
 )
}
```

o componente de card ja existe e seria esse aqui: C:\Users\ReckD\OneDrive\Documentos\GitHub\pessoal\zardui\libs\zard\src\lib\shared\components\card

4.exemplo inicial vai ser o sizes:

```
import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export function CarouselSize() {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full max-w-[12rem] sm:max-w-xs md:max-w-sm"
    >
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-3xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
```

com a descricao: To set the size of the items, you can use the basis utility class on the <CarouselItem />. (obviamente adaptada ao contexto do zard)

5. adicionar o exemplo do spacing:

```
import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export function CarouselSpacing() {
  return (
    <Carousel className="w-full max-w-[12rem] sm:max-w-xs md:max-w-sm">
      <CarouselContent className="-ml-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="basis-1/2 pl-1 lg:basis-1/3">
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-2xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
```

com a descricao: To set the spacing between the items, we use a pl-[VALUE] utility on the <CarouselItem /> and a negative -ml-[VALUE] on the <CarouselContent />.

6. adicionar o Orientation

```
import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export function CarouselOrientation() {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      orientation="vertical"
      className="w-full max-w-xs"
    >
      <CarouselContent className="-mt-1 h-[270px]">
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="basis-1/2 pt-1">
            <div className="p-1">
              <Card>
                <CardContent className="flex items-center justify-center p-6">
                  <span className="text-3xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
```

com a descricao: Use the orientation prop to set the orientation of the carousel.

7. eu quero adicionar uma coisa no component page que vai ser mais uma propriedade chamada code after e code before, onde eu terei um block, um titulo e um description totalmente opcional e conforme eu passo os parametros eles vao aparecendo apos o item que existiver na ordem da listagem dos exemplos, dai o code after fica abaixo do exemplo e o code before fica antes do exemplo, mas com o code before ele de ver acima do exemplo porem abaixo da descricao do exemplo, beleza? dai esses blocks eles podem ter highlight de linha e etc.

8. a opcao de adicionar um exemplo de apenas um code block mas sem codigo rodando, basicamente usar o code block para conseguir exibir um codigo com titulo e descricao que faça parte da estrutura da tela, mas que ainda seja possivel não usar o code block que renderiza o componente, pois essa ideia e apenas para exibir coisas muito especificas.

9. adicionar a opcao de about que vai ser literalmente um titulo chamado about e uma descricao abaixo onde eu vou conseguir escrever um textinho e um link para que eu possa referenciar a lib no projeto, ok? pois alguns componentes utilizam bibliotecas externas.
