package brunorenanpichdev.com.hcm.repository;

import brunorenanpichdev.com.hcm.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AddressRepository extends JpaRepository<Address, UUID> {

    Optional<Address> findByNeighborhoodAndStateAndCityAndStreetAndZipCodeAndNumberHouse(
            String neighborhood,
            String state,
            String city,
            String street,
            String zipCode,
            String numberHouse
    );
}
