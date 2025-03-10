import { currentRecordFiltersComponentState } from '@/object-record/record-filter/states/currentRecordFiltersComponentState';
import { useRecoilComponentValueV2 } from '@/ui/utilities/state/component-state/hooks/useRecoilComponentValueV2';
import { useGetCurrentView } from '@/views/hooks/useGetCurrentView';
import { ViewFilter } from '@/views/types/ViewFilter';
import { ViewFilterGroup } from '@/views/types/ViewFilterGroup';
import { isDefined } from 'twenty-shared';

export const useCurrentViewViewFilterGroup = ({
  viewFilterGroupId,
}: {
  viewFilterGroupId?: string;
}) => {
  const { currentViewWithCombinedFiltersAndSorts } = useGetCurrentView();

  const currentRecordFilters = useRecoilComponentValueV2(
    currentRecordFiltersComponentState,
  );

  const viewFilterGroup =
    currentViewWithCombinedFiltersAndSorts?.viewFilterGroups.find(
      (viewFilterGroup) => viewFilterGroup.id === viewFilterGroupId,
    );

  if (!isDefined(viewFilterGroup)) {
    return {
      currentViewFilterGroup: undefined,
      childViewFiltersAndViewFilterGroups: [] as (
        | ViewFilter
        | ViewFilterGroup
      )[],
    };
  }

  const childRecordFilters = currentRecordFilters.filter(
    (recordFilterToFilter) =>
      recordFilterToFilter.viewFilterGroupId === viewFilterGroup.id,
  );

  const childViewFilterGroups =
    currentViewWithCombinedFiltersAndSorts?.viewFilterGroups.filter(
      (viewFilterGroupToFilter) =>
        viewFilterGroupToFilter.parentViewFilterGroupId === viewFilterGroup.id,
    );

  const childViewFiltersAndViewFilterGroups = [
    ...(childViewFilterGroups ?? []),
    ...(childRecordFilters ?? []),
  ].sort((a, b) => {
    const positionA = a.positionInViewFilterGroup ?? 0;
    const positionB = b.positionInViewFilterGroup ?? 0;
    return positionA - positionB;
  });

  const lastChildPosition =
    childViewFiltersAndViewFilterGroups[
      childViewFiltersAndViewFilterGroups.length - 1
    ]?.positionInViewFilterGroup ?? 0;

  return {
    currentViewFilterGroup: viewFilterGroup,
    childViewFiltersAndViewFilterGroups,
    lastChildPosition,
  };
};
