import React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'

export default function MentorCardSkeleton() {
  return (
    <div className="bg-white border border-sand-200 rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-start gap-3">
      <Skeleton className="w-[52px] h-[52px] rounded-full flex-shrink-0"/>
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
      <div className="flex gap-1">
        {[1,2,3,4,5].map(i => <Skeleton key={i} className="w-3 h-3 rounded-full" />)}
        <Skeleton className="h-3 w-24 ml-1" />
      </div>
      <div className="flex gap-1.5">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>
      <Skeleton className="h-3 w-28" />
      <div className="pt-4 border-t border-sand-100 flex justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  )
}