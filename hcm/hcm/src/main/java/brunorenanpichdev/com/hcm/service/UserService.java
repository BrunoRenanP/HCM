package brunorenanpichdev.com.hcm.service;

import brunorenanpichdev.com.hcm.exception.AddressException;
import brunorenanpichdev.com.hcm.exception.DuplicateCPFException;
import brunorenanpichdev.com.hcm.exception.UserNotFoundException;
import brunorenanpichdev.com.hcm.model.Address;
import brunorenanpichdev.com.hcm.model.User;
import brunorenanpichdev.com.hcm.model.dto.UserDTO;
import brunorenanpichdev.com.hcm.repository.AddressRepository;
import brunorenanpichdev.com.hcm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final AddressService addressService;
    private final AddressRepository addressRepository;

    public UserDTO registerUser(User user) {
        if (user == null) {
            throw new IllegalArgumentException("Mandatory data was not sent");
        }

        if (userRepository.existsByCpf(user.getCpf())) {
            throw new DuplicateCPFException("CPF already exists");
        }

        if (user.getAddress() != null) {
            Optional<Address> existingAddress = addressService.findExistingAddress(user.getAddress());
            if (existingAddress.isPresent()) {
                user.setAddress(existingAddress.get());
            } else {
                addressService.registerAddress(user.getAddress());
            }
        }

        User savedUser = userRepository.save(user);
        return UserDTO.of(savedUser);
    }

    public List<UserDTO> updateUser(User user) {
        if (user == null || user.getId() == null) {
            throw new IllegalArgumentException("Mandatory data was not sent.");
        }

       User existingUser = userRepository.findById(user.getId()).get();

        if (userRepository.existsByCpf(user.getCpf())) {
            throw new DuplicateCPFException("CPF already exists");
        }

        existingUser.setName(user.getName());
        existingUser.setCpf(user.getCpf());
        existingUser.setCellPhone(user.getCellPhone());

        if (user.getAddress() != null) {
            Address existingAddress = addressRepository.findById(user.getAddress().getId())
                    .orElseThrow(() -> new AddressException(AddressException.ErrorType.ADDRESS_NOT_FOUND, "Address not found"));

            existingAddress.setStreet(user.getAddress().getStreet());
            existingAddress.setNumberHouse(user.getAddress().getNumberHouse());
            existingAddress.setCity(user.getAddress().getCity());
            existingAddress.setState(user.getAddress().getState());
            existingAddress.setZipCode(user.getAddress().getZipCode());

            addressRepository.save(existingAddress);
            existingUser.setAddress(existingAddress);
        }

        userRepository.save(existingUser);
        return getUsersSortedByName();
    }

    public List<UserDTO> deleteUser(UUID userId) {
        if (userId == null) {
            throw new IllegalArgumentException("Mandatory data was not sent");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User was not found"));

        userRepository.delete(user);
        return getUsersSortedByName();
    }

    public List<UserDTO> getUsers() {
        return getUsersSortedByName();
    }

    public List<UserDTO> getUsersByName(String name) {
        List<User> userList = userRepository.findByNameContainingIgnoreCaseOrderByNameAsc(name.trim());

        if (userList == null || userList.isEmpty()) {
            throw new IllegalStateException("Users not found");
        }

        return userList.stream()
                .map(UserDTO::of)
                .collect(Collectors.toList());
    }

    private List<UserDTO> getUsersSortedByName() {
        List<User> userList = userRepository.findAllByOrderByNameAsc();

        if (userList == null || userList.isEmpty()) {
            throw new IllegalStateException("Users not found");
        }

        return userList.stream().map(UserDTO::of).collect(Collectors.toList());
    }
}