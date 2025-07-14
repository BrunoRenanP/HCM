package brunorenanpichdev.com.hcm.model.dto;

import brunorenanpichdev.com.hcm.model.Address;
import lombok.*;

import java.util.UUID;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class AddressDTO {

    private UUID id;
    private String street;
    private String numberHouse;
    private String city;
    private String state;
    private String zipCode;
    private String neighborhood;

    public Address toModel() {
        return Address.builder()
                .id(this.id)
                .street(this.street)
                .numberHouse(this.numberHouse)
                .city(this.city)
                .state(this.state)
                .zipCode(this.zipCode)
                .neighborhood(this.neighborhood)
                .build();
    }

    public static AddressDTO of(Address address) {
        return AddressDTO.builder()
                .id(address.getId())
                .street(address.getStreet())
                .numberHouse(address.getNumberHouse())
                .city(address.getCity())
                .state(address.getState())
                .zipCode(address.getZipCode())
                .neighborhood(address.getNeighborhood())
                .build();
    }
}
