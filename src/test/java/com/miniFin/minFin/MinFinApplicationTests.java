package com.miniFin.minFin;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@Disabled("Requires live MySQL; covered by smoke-test job in CI")
class MinFinApplicationTests {

	@Test
	void contextLoads() {
	}

}
