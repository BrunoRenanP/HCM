package brunorenanpichdev.com.hcm.model;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "TB_ENDERECOS")
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Address extends BaseEntity {

    @Column(name = "END_ESTADO", nullable = false, length = 100)
    private String state;

    @Column(name = "END_CIDADE", nullable = false, length = 100)
    private String city;

    @Column(name = "END_RUA", nullable = false, length = 100)
    private String street;

    @Column(name = "END_BAIRRO", nullable = true, length = 100)
    private String neighborhood;

    @Column(name = "END_CEP", nullable = false, length = 9)
    private String zipCode;

    @Column(name = "END_NUMCASA", nullable = false, length = 5)
    private String numberHouse;

}