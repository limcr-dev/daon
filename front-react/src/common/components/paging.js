import { Pagination } from 'rsuite';
import React from 'react';

const Paging = ({ paging, onPageChange }) => {
	
  if (!paging) return null; // 혹은 로딩 표시
	
	const { page, size, totalCount } = paging;

	return (
		<Pagination
			prev
			last
			next
			first
			size="sm"
			total={totalCount}
			limit={size}
			activePage={page}
			onChangePage={onPageChange}
		/>
	);

};

export default Paging;