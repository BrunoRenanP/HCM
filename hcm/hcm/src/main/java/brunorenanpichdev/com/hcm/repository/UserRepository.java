package brunorenanpichdev.com.hcm.repository;

import brunorenanpichdev.com.hcm.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    @Query("SELECT u FROM User u JOIN FETCH u.address ORDER BY u.name ASC")
    List<User> findAllByOrderByNameAsc();

    @Query("SELECT u FROM User u JOIN FETCH u.address WHERE UPPER(u.name) LIKE UPPER(CONCAT('%', :name, '%')) ORDER BY u.name ASC")
    List<User> findByNameContainingIgnoreCaseOrderByNameAsc(String name);

    boolean existsByCpf(String cpf);

    @Query("SELECT u FROM User u JOIN FETCH u.address")
    List<User> findAllWithAddress();
}
