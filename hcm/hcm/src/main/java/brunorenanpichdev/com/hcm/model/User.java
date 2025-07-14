package brunorenanpichdev.com.hcm.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "TB_USUARIOS")
@AllArgsConstructor
@NoArgsConstructor
@Data
@SuperBuilder
public class User extends BaseEntity {

    @Column(name = "USU_NOME", nullable = false)
    private String name;

    @Column(name = "USU_CELL", length = 11)
    private String cellPhone;

    @Column(name = "USU_CPF", nullable = false, length = 11)
    private String cpf;

    @JoinColumn(name = "USU_ENDID", nullable = false)
    @ManyToOne(targetEntity = Address.class, fetch = FetchType.LAZY)
    private Address address;

}
