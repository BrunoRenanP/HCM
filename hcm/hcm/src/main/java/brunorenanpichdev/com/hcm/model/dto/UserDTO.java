package brunorenanpichdev.com.hcm.model.dto;

import brunorenanpichdev.com.hcm.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserDTO {
    private UUID id;
    private String name, cellPhone, cpf;
    private AddressDTO address;

    public static UserDTO of(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .cpf(user.getCpf())
                .cellPhone(user.getCellPhone())
                .address(user.getAddress() != null ? AddressDTO.of(user.getAddress()) : null)
                .build();
    }

    public User toModel() {
        return User.builder()
                .id(this.id)
                .name(this.name)
                .cpf(this.cpf)
                .cellPhone(this.cellPhone)
                .address(this.address != null ? this.address.toModel() : null)
                .build();
    }
}
