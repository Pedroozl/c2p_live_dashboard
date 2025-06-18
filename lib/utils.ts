import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getLocationId(event: any) {
	return event.target.id;
}

export function getLocationName(event: any) {
	return event.target.attributes.name.value;
}

export function getLocationSelected(event: any) {
	return event.target.attributes['aria-checked'].value === 'true';
}