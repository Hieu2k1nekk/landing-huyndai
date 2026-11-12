import type { Vehicle } from '@/types'
import { useVehicleColor } from '@/hooks/useVehicleColor'
import { preloadCarColor } from '@/utils/images'
import { cn } from '@/utils/cn'
import { VehicleColorSelector } from './VehicleColorSelector'

/**
 * Vùng chọn màu gắn với store màu theo mẫu xe (card / trang chi tiết).
 * Chiều cao cố định cho cả trạng thái "đang cập nhật" -> các card trong lưới luôn thẳng hàng.
 */
export function VehicleColorField({
  vehicle,
  sizes,
  size = 'sm',
  maxVisible,
  className,
}: {
  vehicle: Pick<Vehicle, 'slug' | 'name'>
  sizes: string
  size?: 'sm' | 'md'
  maxVisible?: number
  className?: string
}) {
  const { colors, color, setColor, config } = useVehicleColor(vehicle.slug)
  const box = size === 'md' ? 'min-h-[4.75rem]' : 'min-h-[3.75rem]'

  if (!colors.length)
    return (
      <div className={cn(box, 'flex flex-col justify-center', className)}>
        <p className={cn('text-muted', size === 'md' ? 'text-[0.9375rem]' : 'text-[0.8125rem]')}>
          <span className="font-semibold text-ink">Màu sắc:</span> đang cập nhật
        </p>
        {size === 'md' && config.note && <p className="mt-1 text-xs text-muted">{config.note}</p>}
      </div>
    )

  return (
    <VehicleColorSelector
      className={cn(box, className)}
      colors={colors}
      value={color?.id}
      onChange={setColor}
      onPreview={(id) => preloadCarColor(vehicle.slug, id, sizes)}
      label={`Màu ngoại thất ${vehicle.name}`}
      size={size}
      maxVisible={maxVisible}
    />
  )
}
