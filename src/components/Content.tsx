import { useAccount } from 'wagmi';
import { formatEther } from 'ethers';

import { useContractBalance } from 'hooks/web3/useContractBalance';
import { useTotalCollateralAmount } from 'hooks/web3/useTotalCollateralAmount';
import { useTotalRegisterations } from 'hooks/web3/useTotalRegisterations';
import { useTotalBlockShares } from 'hooks/web3/useTotalBlockShares';
import { useUserBalance } from 'hooks/web3/useUserBalance';
import { useUserLastClaimedBlock } from 'hooks/web3/useUserLastClaimedBlock';
import { useUserBlockShares } from 'hooks/web3/useUserBlockShares';
import { useUserCollateral } from 'hooks/web3/useUserCollateral';
import { useUserReward } from 'hooks/web3/useUserReward';
import { useUserRegisterationStatus } from 'hooks/web3/useUserRegisterationStatus';
import { useUserSinceLastClaim } from 'hooks/web3/useUserSinceLastClaim';
import { useRegisterUser } from 'hooks/web3/useRegisterUser';
import { RegistrationStatus } from 'types';
import SvgLoading from 'assets/loading.svg';
import { useClaimRewards } from 'hooks/web3/useClaimRewards';
import { useStartWithdrawal } from 'hooks/web3/useStartWithdrawl';
import { useCompleteWithdrawal } from 'hooks/web3/useCompleteWithdrawal';
import { WITHDRAWAL_DELAY } from 'constants/index';
import WarningModal from './WarningModal';
import { useUserType } from 'hooks/web3/useUserType';
import { UserType } from 'types';
import { useState } from 'react';

const Content = () => {
  const { address } = useAccount();
  const userType = useUserType();
  const [isOpenWarningModal, setIsOpenWarningModal] = useState<boolean>(true);

  const balanceContract = useContractBalance();
  const userRegisterationStatus = useUserRegisterationStatus();
  const totalCollateralAmount = useTotalCollateralAmount();
  const totalRegisterations = useTotalRegisterations();
  const totalBlockShares = useTotalBlockShares();
  const userBalance = useUserBalance();
  const userCollateral = useUserCollateral();
  const userReward = useUserReward();
  const userBlockShares = useUserBlockShares();
  const userLastClaimedBlock = useUserLastClaimedBlock();
  const userSinceLastClaim = useUserSinceLastClaim();

  const { pending: pendingRegisterUser, registerUser } = useRegisterUser();
  const { pending: pendingClaimRewards, claimRewards } = useClaimRewards();
  const { pending: pendingStartWithdrawal, startWithdrawal } = useStartWithdrawal();
  const { pending: pendingCompleteWithdrawal, completeWithdrawal } = useCompleteWithdrawal();

  const checkUser = () => {
    if (userType === UserType.LEGACY_10K || userType === UserType.LEGACY_50K) {
      setIsOpenWarningModal(true);
      return;
    }
    completeWithdrawal();
  };
  const onClose = (state: boolean) => {
    setIsOpenWarningModal(state);
  };

  const renderAction = () => {
    if (userRegisterationStatus === RegistrationStatus.UNREGISTERED) {
      return (
        <button
          disabled={pendingRegisterUser || userBalance < userCollateral}
          className="m-button"
          onClick={registerUser}
        >
          Register
          {pendingRegisterUser && <img src={SvgLoading} className="w-20 h-20" alt="" />}
        </button>
      );
    } else if (userRegisterationStatus === RegistrationStatus.REGISTERED) {
      return (
        <>
          <button
            disabled={userReward === 0 || pendingClaimRewards || pendingStartWithdrawal}
            className="m-button"
            onClick={claimRewards}
          >
            Claim rewards
            {pendingClaimRewards && <img src={SvgLoading} className="w-20 h-20" alt="" />}
          </button>
          <button
            disabled={pendingClaimRewards || pendingStartWithdrawal}
            className="m-button"
            onClick={startWithdrawal}
          >
            Start withdrawal
            {pendingStartWithdrawal && <img src={SvgLoading} className="w-20 h-20" alt="" />}
          </button>
        </>
      );
    } else if (userRegisterationStatus === RegistrationStatus.WITHDRAWING) {
      return (
        <button
          disabled={pendingCompleteWithdrawal || userSinceLastClaim < WITHDRAWAL_DELAY}
          className="m-button"
          onClick={checkUser}
        >
          Complete withdrawal
          {pendingCompleteWithdrawal && <img src={SvgLoading} className="w-20 h-20" alt="" />}
        </button>
      );
    }

    return null;
  };

  return (
    <main className="p-16 flex flex-col gap-12">
      <WarningModal
        isOpen={isOpenWarningModal}
        onClose={onClose}
        onConfirm={() => {
          setIsOpenWarningModal(false);
          completeWithdrawal();
        }}
      />
      <div className="flex gap-8 flex-col md:flex-row">
        <div className="border border-gray-200 p-12 rounded-6 flex flex-col gap-4">
          <div className="font-bold">MasterNode contract balance</div>
          <div>{formatEther(balanceContract)} STRAT</div>
        </div>
        <div className="border border-gray-200 p-12 rounded-6 flex flex-col gap-4">
          <div className="font-bold">Total collateral amount</div>
          <div>{formatEther(totalCollateralAmount)} STRAT</div>
        </div>
        <div className="border border-gray-200 p-12 rounded-6 flex flex-col gap-4">
          <div className="font-bold">Total registrations</div>
          <div>{totalRegisterations.toString()}</div>
        </div>
        <div className="border border-gray-200 p-12 rounded-6 flex flex-col gap-4">
          <div className="font-bold">Total block shares</div>
          <div>{totalBlockShares.toString()}</div>
        </div>
      </div>
      {address && (
        <>
          <div className="flex gap-8 flex-col md:flex-row">
            <div className="border border-gray-200 p-12 rounded-6 flex flex-col gap-4">
              <div className="font-bold">Balance</div>
              <div>{formatEther(userBalance)} STRAT</div>
            </div>
            <div className="border border-gray-200 p-12 rounded-6 flex flex-col gap-4">
              <div className="font-bold">Rewards</div>
              <div>{formatEther(userReward)} STRAT</div>
            </div>
            <div className="border border-gray-200 p-12 rounded-6 flex flex-col gap-4">
              <div className="font-bold">Collateral amount</div>
              <div>{formatEther(userCollateral)} STRAT</div>
            </div>
            <div className="border border-gray-200 p-12 rounded-6 flex flex-col gap-4">
              <div className="font-bold">Block shares</div>
              <div>{userBlockShares.toString()}</div>
            </div>
            <div className="border border-gray-200 p-12 rounded-6 flex flex-col gap-4">
              <div className="font-bold">Last claimed block</div>
              <div>{userLastClaimedBlock.toString()}</div>
            </div>
          </div>
          <div className="flex items-center gap-12 flex-wrap">{renderAction()}</div>
        </>
      )}
    </main>
  );
};

export default Content;
