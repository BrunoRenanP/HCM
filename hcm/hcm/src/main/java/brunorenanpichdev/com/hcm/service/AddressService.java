package brunorenanpichdev.com.hcm.service;

import brunorenanpichdev.com.hcm.exception.AddressException;
import brunorenanpichdev.com.hcm.model.Address;
import brunorenanpichdev.com.hcm.repository.AddressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository repository;

    public void registerAddress(Address address) {
        validateAddressNotNull(address);

        Optional<Address> existing = findExistingAddress(address);
        if (existing.isEmpty()) {
            repository.save(address);
        }
    }

    public void deleteAddress(UUID addressId) {
        if (addressId == null) {
            throw new AddressException(AddressException.ErrorType.INVALID_ADDRESS, "Address ID cannot be null.");
        }

        Address address = repository.findById(addressId)
                .orElseThrow(() -> new AddressException(AddressException.ErrorType.ADDRESS_NOT_FOUND, "Address not found."));

        repository.delete(address);
    }

    public void updateAddress(Address address) {
        validateAddressNotNull(address);

        if (address.getId() == null) {
            throw new AddressException(AddressException.ErrorType.INVALID_ADDRESS, "Address ID cannot be null.");
        }

        repository.findById(address.getId())
                .orElseThrow(() -> new AddressException(AddressException.ErrorType.ADDRESS_NOT_FOUND, "Address not found."));

        repository.save(address);
    }

    public Optional<Address> findExistingAddress(Address address) {
        validateAddressNotNull(address);

        return repository.findByNeighborhoodAndStateAndCityAndStreetAndZipCodeAndNumberHouse(
                address.getNeighborhood(),
                address.getState(),
                address.getCity(),
                address.getStreet(),
                address.getZipCode(),
                address.getNumberHouse()
        );
    }

    private void validateAddressNotNull(Address address) {
        if (address == null) {
            throw new AddressException(AddressException.ErrorType.INVALID_ADDRESS, "Required data was not provided.");
        }
    }
}
