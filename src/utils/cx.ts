import clsx, { ClassValue } from 'clsx'

type TemplateLike = TemplateStringsArray | ClassValue
type ParamsLike = ClassValue[]

const cx = (template: TemplateLike, ...params: ParamsLike): string => {
  if (typeof template === 'string') return clsx(template, ...params)

  template = Array.isArray(template) ? template : [template]
  let merged = template.join('') + params.join('')
  merged = merged.replace(/\s+/g, ' ').trim()

  return clsx(merged)
}

export default cx
