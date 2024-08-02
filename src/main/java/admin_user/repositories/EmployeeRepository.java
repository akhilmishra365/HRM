package admin_user.repositories;



import org.springframework.data.jpa.repository.JpaRepository;

import admin_user.dto.EmployeeDetail;
import admin_user.dto.TicketDto;
import admin_user.model.User;

import java.util.List;




public interface EmployeeRepository extends JpaRepository<EmployeeDetail, Long> {

	List<EmployeeDetail> findByEmpId(String empId);

}