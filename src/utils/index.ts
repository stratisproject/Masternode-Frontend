import { RegistrationStatus } from 'types'

export function isUserRegistered(status: RegistrationStatus) {
  return status != RegistrationStatus.UNREGISTERED
}

export function isUserWithdrawing(status: RegistrationStatus) {
  return status == RegistrationStatus.WITHDRAWING
}
